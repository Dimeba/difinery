// Shared session resolution for places that CAN write cookies:
// proxy.js (middleware) and route handlers. Edge-runtime safe — no next/headers.

import { COOKIES } from './config'
import { refreshTokens, setSessionCookies } from './tokens'

// Refresh a little before the real expiry so an in-flight request never
// lands on a token that expires mid-flight.
const EXPIRY_SKEW_MS = 60_000

/**
 * Returns a usable access token for the request, refreshing it when needed.
 * Any refreshed tokens are written onto `response`.
 *
 * @returns {Promise<string|null>} the access token, or null when signed out.
 */
export async function ensureAccessToken(request, response) {
	const access = request.cookies.get(COOKIES.access)?.value
	const expiresAt = Number(request.cookies.get(COOKIES.expiresAt)?.value || 0)

	if (access && Date.now() < expiresAt - EXPIRY_SKEW_MS) {
		return access
	}

	const refresh = request.cookies.get(COOKIES.refresh)?.value
	if (!refresh) return null

	const tokens = await refreshTokens(refresh)
	if (!tokens?.access_token) return null

	setSessionCookies(response, tokens)
	return tokens.access_token
}
