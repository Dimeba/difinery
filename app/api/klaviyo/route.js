import { NextResponse } from 'next/server'

// Map list names to Klaviyo list IDs
// These should be set in your environment variables
const LIST_ID_MAP = {
	// Example mappings - replace with your actual list IDs
	'subscribers': process.env.KLAVIYO_LIST_SUBSCRIBERS_ID,
	'engagement-rings': process.env.KLAVIYO_LIST_ENGAGEMENT_RINGS_ID,
	'special-request': process.env.KLAVIYO_LIST_SPECIAL_REQUEST_ID,
	'default': process.env.KLAVIYO_LIST_DEFAULT_ID
}

export async function POST(request) {
	try {
		const body = await request.json()
		const { listName, data } = body

		if (!listName) {
			return NextResponse.json(
				{ error: 'List name is required' },
				{ status: 400 }
			)
		}

		// Get the list ID from the map
		const listId = LIST_ID_MAP[listName]

		if (!listId) {
			return NextResponse.json(
				{ error: `List ID not found for list name: ${listName}` },
				{ status: 400 }
			)
		}

		// Get API key from environment
		const apiKey = process.env.KLAVIYO_API_KEY

		if (!apiKey) {
			return NextResponse.json(
				{ error: 'Klaviyo API key not configured' },
				{ status: 500 }
			)
		}

		// Prepare Klaviyo profile data
		// Klaviyo expects email as the primary identifier
		const email = data.email || data.Email || data.EMAIL

		if (!email) {
			return NextResponse.json({ error: 'Email is required' }, { status: 400 })
		}

		// Build profile attributes
		const profileAttributes = {}
		Object.keys(data).forEach(key => {
			if (key.toLowerCase() !== 'email') {
				profileAttributes[key] = data[key]
			}
		})

		// First, create or update the profile
		const profileUrl = 'https://a.klaviyo.com/api/profiles/'

		const profilePayload = {
			data: {
				type: 'profile',
				attributes: {
					email: email,
					...profileAttributes
				}
			}
		}

		// Create/update profile
		const profileResponse = await fetch(profileUrl, {
			method: 'POST',
			headers: {
				'Authorization': `Klaviyo-API-Key ${apiKey}`,
				'Content-Type': 'application/json',
				'revision': '2024-02-15'
			},
			body: JSON.stringify(profilePayload)
		})

		let profileId

		if (profileResponse.ok) {
			// Profile created successfully
			const profileResult = await profileResponse.json()
			profileId = profileResult.data.id
		} else if (profileResponse.status === 409) {
			// Profile already exists - extract duplicate profile ID from error
			const errorData = await profileResponse.json()
			if (
				errorData.errors &&
				errorData.errors[0] &&
				errorData.errors[0].meta?.duplicate_profile_id
			) {
				profileId = errorData.errors[0].meta.duplicate_profile_id

				// Optionally update the existing profile with new attributes
				if (Object.keys(profileAttributes).length > 0) {
					const updateUrl = `https://a.klaviyo.com/api/profiles/${profileId}/`
					const updatePayload = {
						data: {
							type: 'profile',
							id: profileId,
							attributes: profileAttributes
						}
					}

					await fetch(updateUrl, {
						method: 'PATCH',
						headers: {
							'Authorization': `Klaviyo-API-Key ${apiKey}`,
							'Content-Type': 'application/json',
							'revision': '2024-02-15'
						},
						body: JSON.stringify(updatePayload)
					})
				}
			} else {
				// Couldn't extract duplicate profile ID
				console.error(
					'Klaviyo duplicate profile error - no ID found:',
					errorData
				)
				return NextResponse.json(
					{
						error: 'Profile already exists but could not retrieve ID',
						details: errorData
					},
					{ status: 409 }
				)
			}
		} else {
			// Other error
			const errorData = await profileResponse.text()
			console.error('Klaviyo profile creation error:', errorData)
			return NextResponse.json(
				{ error: 'Failed to create/update profile', details: errorData },
				{ status: profileResponse.status }
			)
		}

		// Subscribe the profile to the list using list relationships endpoint
		const subscribeUrl = `https://a.klaviyo.com/api/lists/${listId}/relationships/profiles/`

		const subscribePayload = {
			data: [
				{
					type: 'profile',
					id: profileId
				}
			]
		}

		// Subscribe to list
		const response = await fetch(subscribeUrl, {
			method: 'POST',
			headers: {
				'Authorization': `Klaviyo-API-Key ${apiKey}`,
				'Content-Type': 'application/json',
				'revision': '2024-02-15'
			},
			body: JSON.stringify(subscribePayload)
		})

		if (!response.ok) {
			const errorText = await response.text()
			let errorData
			try {
				errorData = errorText ? JSON.parse(errorText) : errorText
			} catch {
				errorData = errorText
			}
			console.error('Klaviyo API error:', errorData)
			return NextResponse.json(
				{ error: 'Failed to subscribe to Klaviyo list', details: errorData },
				{ status: response.status }
			)
		}

		// Check if response has content before parsing
		const responseText = await response.text()
		let result = null

		if (responseText && responseText.trim()) {
			try {
				result = JSON.parse(responseText)
			} catch (parseError) {
				console.error('Failed to parse Klaviyo response:', parseError)
				// If parsing fails, still return success if status was OK
				result = { message: 'Subscription successful (no response body)' }
			}
		}

		return NextResponse.json({
			success: true,
			message: 'Successfully subscribed to list',
			data: result
		})
	} catch (error) {
		console.error('Klaviyo API route error:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: error.message },
			{ status: 500 }
		)
	}
}
