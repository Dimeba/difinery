import { NextResponse } from 'next/server'

// Map list names to Klaviyo list IDs
// These should be set in your environment variables
const LIST_ID_MAP = {
	// Example mappings - replace with your actual list IDs
	'subscribers': process.env.KLAVIYO_LIST_SUBSCRIBERS_ID,
	'blank-canvas': process.env.KLAVIYO_LIST_BLANK_CANVAS_ID,
	'special-requests': process.env.KLAVIYO_LIST_SPECIAL_REQUESTS_ID
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

		// Helper function to format phone number to E.164 format
		const formatPhoneNumber = phone => {
			if (!phone) return phone

			// Remove all non-digit characters
			const digitsOnly = phone.replace(/\D/g, '')

			// If already starts with +, return as is
			if (phone.startsWith('+')) {
				return phone
			}

			// If starts with country code (e.g., 1 for US), add +
			if (digitsOnly.length >= 10) {
				// Assume US/Canada if 10 digits, add +1
				if (digitsOnly.length === 10) {
					return `+1${digitsOnly}`
				}
				// If 11 digits and starts with 1, add +
				if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
					return `+${digitsOnly}`
				}
				// Otherwise, try to detect country code or default to +1
				// For now, if it's longer than 10 digits, assume it has country code
				return `+${digitsOnly}`
			}

			// If less than 10 digits, return as is (might be invalid)
			return phone
		}

		// Map form field names to snake_case for properties
		const fieldNameMap = {
			phoneNumber: 'phone_number',
			phone_number: 'phone_number',
			fullName: 'full_name',
			full_name: 'full_name',
			firstName: 'first_name',
			first_name: 'first_name',
			lastName: 'last_name',
			last_name: 'last_name',
			dateOfBirth: 'date_of_birth',
			date_of_birth: 'date_of_birth'
		}

		// Build properties - put everything in properties
		const profileProperties = {}

		Object.keys(data).forEach(key => {
			if (key.toLowerCase() !== 'email') {
				let value = data[key]
				if (!value || (typeof value === 'string' && !value.trim())) return // Skip empty values

				// Handle firstName and lastName - map directly to first_name and last_name
				if (key === 'firstName' || key === 'first_name') {
					profileProperties.first_name = value
					return
				}
				if (key === 'lastName' || key === 'last_name') {
					profileProperties.last_name = value
					return
				}

				// Handle fullName - split into first_name and last_name if space exists
				if (key === 'fullName' && typeof value === 'string') {
					const nameParts = value.trim().split(/\s+/)
					if (nameParts.length > 1) {
						profileProperties.first_name = nameParts[0]
						profileProperties.last_name = nameParts.slice(1).join(' ')
					} else {
						profileProperties.first_name = value
					}
					return
				}

				// Map to snake_case property name
				const propertyKey =
					fieldNameMap[key] ||
					key
						.replace(/([A-Z])/g, '_$1')
						.toLowerCase()
						.replace(/^_/, '')

				// Format phone number if it's a phone field
				if (propertyKey === 'phone_number' && typeof value === 'string') {
					value = formatPhoneNumber(value)
				}

				profileProperties[propertyKey] = value
			}
		})

		// First, create or update the profile
		const profileUrl = 'https://a.klaviyo.com/api/profiles/'

		const profilePayload = {
			data: {
				type: 'profile',
				attributes: {
					email: email,
					// Put everything in properties
					...(Object.keys(profileProperties).length > 0 && {
						properties: profileProperties
					})
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

				// Optionally update the existing profile with new properties
				if (Object.keys(profileProperties).length > 0) {
					const updateUrl = `https://a.klaviyo.com/api/profiles/${profileId}/`
					const updatePayload = {
						data: {
							type: 'profile',
							id: profileId,
							attributes: {
								properties: profileProperties
							}
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
			const errorText = await profileResponse.text()
			let errorData
			try {
				errorData = errorText ? JSON.parse(errorText) : errorText
			} catch {
				errorData = errorText
			}

			// Check if it's a phone number error
			if (
				errorData?.errors?.[0]?.detail?.toLowerCase().includes('phone') ||
				errorData?.errors?.[0]?.detail
					?.toLowerCase()
					.includes('invalid or unsupported phone')
			) {
				return NextResponse.json(
					{
						error:
							'Invalid phone number format. Please use a valid phone number (e.g., +1234567890).',
						errorType: 'phone',
						details: errorData
					},
					{ status: profileResponse.status }
				)
			}

			return NextResponse.json(
				{ error: 'Failed to create/update profile', details: errorData },
				{ status: profileResponse.status }
			)
		}

		// If there are custom properties, try to update profile with them again
		// Sometimes properties need to be sent separately or in a different format
		if (Object.keys(profileProperties).length > 0) {
			try {
				const updateUrl = `https://a.klaviyo.com/api/profiles/${profileId}/`
				const updatePayload = {
					data: {
						type: 'profile',
						id: profileId,
						attributes: {
							properties: profileProperties
						}
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
			} catch (updateError) {
				// Silently fail if properties update fails
			}
		}

		// Subscribe the profile to the list with email marketing consent
		const subscribeUrl = `https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/`

		// For subscription, only send email and subscriptions
		// Profile data is already saved in the profile creation step above
		const subscribePayload = {
			data: {
				type: 'profile-subscription-bulk-create-job',
				attributes: {
					profiles: {
						data: [
							{
								type: 'profile',
								id: profileId,
								attributes: {
									email: email,
									subscriptions: {
										email: {
											marketing: { consent: 'SUBSCRIBED' }
										}
									}
								}
							}
						]
					}
				},
				relationships: {
					list: {
						data: {
							type: 'list',
							id: listId
						}
					}
				}
			}
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
		return NextResponse.json(
			{ error: 'Internal server error', details: error.message },
			{ status: 500 }
		)
	}
}
