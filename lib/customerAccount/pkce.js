// PKCE + OAuth nonce helpers.
//
// Uses Web Crypto only (no node:crypto) so these run unchanged in route
// handlers and in proxy.js, which executes on the Netlify edge runtime.

function base64UrlEncode(bytes) {
	let binary = ''
	const view = new Uint8Array(bytes)
	for (let i = 0; i < view.length; i++) binary += String.fromCharCode(view[i])
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function randomString(byteLength = 32) {
	const bytes = new Uint8Array(byteLength)
	crypto.getRandomValues(bytes)
	return base64UrlEncode(bytes)
}

/** Random high-entropy string used as the PKCE code_verifier. */
export function createVerifier() {
	return randomString(32)
}

/** S256 challenge derived from the verifier. */
export async function challengeFromVerifier(verifier) {
	const digest = await crypto.subtle.digest(
		'SHA-256',
		new TextEncoder().encode(verifier)
	)
	return base64UrlEncode(digest)
}

/** CSRF token echoed back by Shopify on the callback. */
export function randomState() {
	return randomString(16)
}

/** Replay protection for the OpenID id_token. */
export function randomNonce() {
	return randomString(16)
}
