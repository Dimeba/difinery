import { NextResponse } from 'next/server'

import { customerFetchWithToken, UnauthorizedError } from '@/lib/customerAccount/client'
import { isConfigured } from '@/lib/customerAccount/config'
import { CUSTOMER_ME } from '@/lib/customerAccount/queries'
import { ensureAccessToken } from '@/lib/customerAccount/session'
import { clearSessionCookies } from '@/lib/customerAccount/tokens'
import { isUbsEligibleEmail } from '@/lib/ubs'

export const dynamic = 'force-dynamic'

const NO_STORE = { 'Cache-Control': 'private, no-store, max-age=0' }

export async function GET(request) {
	if (!isConfigured()) {
		return NextResponse.json({ loggedIn: false }, { headers: NO_STORE })
	}

	// Built up front so ensureAccessToken can write refreshed cookies onto it.
	const response = NextResponse.json({ loggedIn: false }, { headers: NO_STORE })

	const accessToken = await ensureAccessToken(request, response)
	if (!accessToken) {
		clearSessionCookies(response)
		return response
	}

	try {
		const data = await customerFetchWithToken(accessToken, CUSTOMER_ME)
		const customer = data?.customer

		if (!customer) {
			clearSessionCookies(response)
			return response
		}

		const email = customer.emailAddress?.emailAddress || null

		const payload = {
			loggedIn: true,
			customer: {
				id: customer.id,
				firstName: customer.firstName,
				lastName: customer.lastName,
				displayName: customer.displayName,
				email,
				ubsEligible: isUbsEligibleEmail(email)
			}
		}

		// Re-wrap so refreshed cookies set above survive into the final response.
		const ok = NextResponse.json(payload, { headers: NO_STORE })
		for (const cookie of response.cookies.getAll()) ok.cookies.set(cookie)
		return ok
	} catch (error) {
		if (error instanceof UnauthorizedError) {
			clearSessionCookies(response)
			return response
		}
		console.error('/api/account/me failed:', error.message)
		return NextResponse.json(
			{ loggedIn: false, error: 'lookup-failed' },
			{ status: 500, headers: NO_STORE }
		)
	}
}
