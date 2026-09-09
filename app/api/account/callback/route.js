import { NextResponse } from 'next/server'

import { COOKIES, isConfigured, safeReturnTo } from '@/lib/customerAccount/config'
import {
	clearTransactionCookies,
	exchangeCode,
	setSessionCookies
} from '@/lib/customerAccount/tokens'

export const dynamic = 'force-dynamic'

function failure(request, reason) {
	// Deliberately outside /account — that layout requires a session, so an
	// error page under it would bounce straight back into the login flow.
	const url = new URL('/sign-in-error', request.url)
	url.searchParams.set('reason', reason)
	const response = NextResponse.redirect(url)
	clearTransactionCookies(response)
	return response
}

export async function GET(request) {
	if (!isConfigured()) return failure(request, 'not-configured')

	const params = request.nextUrl.searchParams

	// Shopify reports a refused/aborted login here rather than with an error status.
	if (params.get('error')) {
		return failure(request, params.get('error'))
	}

	const code = params.get('code')
	const state = params.get('state')

	const expectedState = request.cookies.get(COOKIES.state)?.value
	const verifier = request.cookies.get(COOKIES.verifier)?.value
	const returnTo = safeReturnTo(request.cookies.get(COOKIES.returnTo)?.value)

	if (!code) return failure(request, 'missing-code')
	if (!state || !expectedState || state !== expectedState) {
		return failure(request, 'state-mismatch')
	}

	let tokens
	try {
		tokens = await exchangeCode(code, verifier)
	} catch (error) {
		console.error('Customer Account code exchange failed:', error.message)
		return failure(request, 'token-exchange')
	}

	// The wishlist a guest built up lives in localStorage, so the merge has to
	// happen in the browser. /account picks up this flag and posts the merge.
	const destination = new URL(returnTo, request.url)
	destination.searchParams.set('justSignedIn', '1')

	const response = NextResponse.redirect(destination)
	setSessionCookies(response, tokens)
	clearTransactionCookies(response)
	response.headers.set('Cache-Control', 'private, no-store, max-age=0')
	return response
}
