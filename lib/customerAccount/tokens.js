// Token exchange, refresh and session cookie handling for the
// Shopify Customer Account API. SERVER ONLY.

import { CA, COOKIES, isConfidential } from './config'

const isProd = process.env.NODE_ENV === 'production'

function basicAuthHeader() {
	return `Basic ${btoa(`${CA.clientId}:${CA.clientSecret}`)}`
}

function tokenRequestHeaders() {
	const headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'User-Agent': 'Difinery Storefront'
	}
	if (isConfidential()) {
		headers.Authorization = basicAuthHeader()
	} else {
		// Public clients must send an Origin that matches a registered
		// JavaScript origin in the Customer Account API settings.
		headers.Origin = CA.siteUrl
	}
	return headers
}

async function postToken(body) {
	const res = await fetch(CA.tokenUrl, {
		method: 'POST',
		headers: tokenRequestHeaders(),
		body: body.toString(),
		cache: 'no-store'
	})

	if (!res.ok) {
		const detail = await res.text().catch(() => '')
		throw new Error(
			`Customer Account token request failed (${res.status}): ${detail.slice(0, 300)}`
		)
	}

	return res.json()
}

/** Exchanges an authorization code for an access/refresh token pair. */
export async function exchangeCode(code, verifier) {
	const body = new URLSearchParams({
		grant_type: 'authorization_code',
		client_id: CA.clientId,
		redirect_uri: CA.redirectUri,
		code
	})
	if (verifier) body.set('code_verifier', verifier)
	return postToken(body)
}

/**
 * Trades a refresh token for a fresh access token. Returns null instead of
 * throwing so callers (notably proxy.js) can fall through to a re-login.
 */
export async function refreshTokens(refreshToken) {
	try {
		return await postToken(
			new URLSearchParams({
				grant_type: 'refresh_token',
				client_id: CA.clientId,
				refresh_token: refreshToken
			})
		)
	} catch (error) {
		console.error('Customer Account token refresh failed:', error.message)
		return null
	}
}

const baseCookie = {
	httpOnly: true,
	secure: isProd,
	sameSite: 'lax',
	path: '/'
}

/**
 * Writes the session onto a NextResponse. Shopify does not always return a new
 * refresh token or id_token on refresh, so those are only overwritten when present.
 */
export function setSessionCookies(response, tokens) {
	const expiresAt = Date.now() + (tokens.expires_in ?? 7200) * 1000
	const maxAge = 60 * 60 * 24 * 30

	response.cookies.set(COOKIES.access, tokens.access_token, {
		...baseCookie,
		maxAge
	})
	response.cookies.set(COOKIES.expiresAt, String(expiresAt), {
		...baseCookie,
		maxAge
	})

	if (tokens.refresh_token) {
		response.cookies.set(COOKIES.refresh, tokens.refresh_token, {
			...baseCookie,
			maxAge
		})
	}
	if (tokens.id_token) {
		response.cookies.set(COOKIES.idToken, tokens.id_token, {
			...baseCookie,
			maxAge
		})
	}

	// Readable by the client so the header can render the logged-in state
	// immediately on statically served pages.
	response.cookies.set(COOKIES.flag, '1', {
		httpOnly: false,
		secure: isProd,
		sameSite: 'lax',
		path: '/',
		maxAge
	})

	return response
}

export function clearSessionCookies(response) {
	for (const name of [
		COOKIES.access,
		COOKIES.refresh,
		COOKIES.idToken,
		COOKIES.expiresAt,
		COOKIES.state,
		COOKIES.nonce,
		COOKIES.verifier,
		COOKIES.returnTo
	]) {
		response.cookies.set(name, '', { ...baseCookie, maxAge: 0 })
	}
	response.cookies.set(COOKIES.flag, '', {
		httpOnly: false,
		secure: isProd,
		sameSite: 'lax',
		path: '/',
		maxAge: 0
	})
	return response
}

/** Short-lived cookies that only need to survive the round trip to Shopify. */
export function setTransactionCookies(response, { state, nonce, verifier, returnTo }) {
	const options = { ...baseCookie, maxAge: 60 * 10 }
	response.cookies.set(COOKIES.state, state, options)
	response.cookies.set(COOKIES.nonce, nonce, options)
	response.cookies.set(COOKIES.verifier, verifier, options)
	response.cookies.set(COOKIES.returnTo, returnTo, options)
	return response
}

export function clearTransactionCookies(response) {
	for (const name of [
		COOKIES.state,
		COOKIES.nonce,
		COOKIES.verifier,
		COOKIES.returnTo
	]) {
		response.cookies.set(name, '', { ...baseCookie, maxAge: 0 })
	}
	return response
}
