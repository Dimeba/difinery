import { NextResponse } from 'next/server'

import { CA, isConfigured, safeReturnTo } from '@/lib/customerAccount/config'
import {
	challengeFromVerifier,
	createVerifier,
	randomNonce,
	randomState
} from '@/lib/customerAccount/pkce'
import { setTransactionCookies } from '@/lib/customerAccount/tokens'

export const dynamic = 'force-dynamic'

export async function GET(request) {
	if (!isConfigured()) {
		return NextResponse.json(
			{ error: 'Customer accounts are not configured yet.' },
			{ status: 503 }
		)
	}

	const returnTo = safeReturnTo(
		request.nextUrl.searchParams.get('returnTo'),
		'/account'
	)

	const state = randomState()
	const nonce = randomNonce()
	const verifier = createVerifier()
	const challenge = await challengeFromVerifier(verifier)

	const authorize = new URL(CA.authorizeUrl)
	authorize.searchParams.set('client_id', CA.clientId)
	authorize.searchParams.set('response_type', 'code')
	authorize.searchParams.set('redirect_uri', CA.redirectUri)
	authorize.searchParams.set('scope', CA.scope)
	authorize.searchParams.set('state', state)
	authorize.searchParams.set('nonce', nonce)
	authorize.searchParams.set('code_challenge', challenge)
	authorize.searchParams.set('code_challenge_method', 'S256')

	// Prefills the email on Shopify's sign-in page (used by the UBS form).
	const loginHint = request.nextUrl.searchParams.get('login_hint')
	if (loginHint) authorize.searchParams.set('login_hint', loginHint)

	const response = NextResponse.redirect(authorize.toString())
	setTransactionCookies(response, { state, nonce, verifier, returnTo })
	response.headers.set('Cache-Control', 'private, no-store, max-age=0')
	return response
}
