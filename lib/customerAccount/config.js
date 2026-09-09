// Shopify Customer Account API configuration.
//
// SERVER ONLY. These values must never reach the client bundle, so they are
// read straight from process.env here and are deliberately NOT added to the
// `env:` block in next.config.mjs — that block inlines values into the client
// bundle, which would leak the client secret.

const SCOPE = 'openid email customer-account-api:full'

export const CA = {
	get clientId() {
		return process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID
	},
	get clientSecret() {
		return process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET
	},
	get authorizeUrl() {
		return process.env.SHOPIFY_CA_AUTHORIZE_URL
	},
	get tokenUrl() {
		return process.env.SHOPIFY_CA_TOKEN_URL
	},
	get logoutUrl() {
		return process.env.SHOPIFY_CA_LOGOUT_URL
	},
	get graphqlUrl() {
		return process.env.SHOPIFY_CA_GRAPHQL_URL
	},
	get siteUrl() {
		return process.env.NEXT_PUBLIC_SITE_URL || 'https://difinery.com'
	},
	get redirectUri() {
		return `${CA.siteUrl}/api/account/callback`
	},
	scope: SCOPE
}

// Cookie names. `dfn_auth` is the only one readable from JS — it is a bare
// "1" flag so the header can paint the logged-in state without a round trip.
export const COOKIES = {
	access: 'dfn_cat',
	refresh: 'dfn_crt',
	idToken: 'dfn_idt',
	expiresAt: 'dfn_exp',
	flag: 'dfn_auth',
	state: 'dfn_state',
	nonce: 'dfn_nonce',
	verifier: 'dfn_verifier',
	returnTo: 'dfn_return'
}

/**
 * True when every value needed for the OAuth flow is present. Lets routes fail
 * with a clear message instead of a cryptic fetch error when env vars are missing.
 */
export function isConfigured() {
	return Boolean(
		CA.clientId && CA.authorizeUrl && CA.tokenUrl && CA.graphqlUrl
	)
}

/**
 * Confidential clients hold a secret and authenticate the token request with a
 * Basic header. Public clients rely on PKCE plus a registered Origin instead.
 */
export function isConfidential() {
	return Boolean(CA.clientSecret)
}

/**
 * Guards against open redirects: only same-site absolute paths are accepted.
 */
export function safeReturnTo(value, fallback = '/account') {
	if (typeof value !== 'string' || !value) return fallback
	if (!value.startsWith('/')) return fallback
	if (value.startsWith('//')) return fallback
	return value
}
