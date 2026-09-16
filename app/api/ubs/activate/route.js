import { NextResponse } from 'next/server'

import { isUbsEligibleEmail } from '@/lib/ubs'

export const dynamic = 'force-dynamic'

const NO_STORE = { 'Cache-Control': 'private, no-store, max-age=0' }

// Where the Shopify login sends the customer back to.
const RETURN_TO = '/ubs#activate-benefit'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Checks the domain before sending the visitor to the Shopify login.
 *
 * This is only a gate on who gets sent to sign in. Eligibility itself is
 * decided later from the verified email on the customer's session, since
 * anyone can type an address into this form.
 */
export async function POST(request) {
	let email
	try {
		({ email } = await request.json())
	} catch {
		return NextResponse.json(
			{ error: 'invalid-body' },
			{ status: 400, headers: NO_STORE }
		)
	}

	email = typeof email === 'string' ? email.trim() : ''

	if (!EMAIL_PATTERN.test(email)) {
		return NextResponse.json(
			{ error: 'invalid-email' },
			{ status: 400, headers: NO_STORE }
		)
	}

	if (!isUbsEligibleEmail(email)) {
		return NextResponse.json(
			{ error: 'domain' },
			{ status: 400, headers: NO_STORE }
		)
	}

	const params = new URLSearchParams({ returnTo: RETURN_TO, login_hint: email })

	return NextResponse.json(
		{ loginUrl: `/api/account/login?${params.toString()}` },
		{ headers: NO_STORE }
	)
}
