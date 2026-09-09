import { NextResponse } from 'next/server'

import { CA, COOKIES } from '@/lib/customerAccount/config'
import { clearSessionCookies } from '@/lib/customerAccount/tokens'

export const dynamic = 'force-dynamic'

async function handleLogout(request) {
	const idToken = request.cookies.get(COOKIES.idToken)?.value

	// Without an id_token Shopify cannot end its own session, so fall back to
	// just dropping our cookies.
	let destination = new URL('/', request.url).toString()

	if (idToken && CA.logoutUrl) {
		const logout = new URL(CA.logoutUrl)
		logout.searchParams.set('id_token_hint', idToken)
		logout.searchParams.set('post_logout_redirect_uri', CA.siteUrl)
		destination = logout.toString()
	}

	const response = NextResponse.redirect(destination)
	clearSessionCookies(response)
	response.headers.set('Cache-Control', 'private, no-store, max-age=0')
	return response
}

export const GET = handleLogout
export const POST = handleLogout
