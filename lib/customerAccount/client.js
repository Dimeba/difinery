// Authenticated GraphQL client for the Shopify Customer Account API.
//
// Deliberately separate from lib/apolloClient.js: that client is a module-level
// singleton shared across the whole server process, so a per-customer token
// must never be attached to it.

import { cookies } from 'next/headers'
import { CA, COOKIES, isConfigured } from './config'

export class UnauthorizedError extends Error {
	constructor(message = 'Not signed in') {
		super(message)
		this.name = 'UnauthorizedError'
	}
}

/**
 * Runs a query against the Customer Account API with an explicit token.
 * Used by route handlers that already hold a freshly minted token.
 */
export async function customerFetchWithToken(accessToken, query, variables = {}) {
	if (!isConfigured()) {
		throw new Error(
			'Customer Account API is not configured — missing SHOPIFY_CA_* env vars'
		)
	}
	if (!accessToken) throw new UnauthorizedError()

	const res = await fetch(CA.graphqlUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			// Shopify expects the bare token here, not a `Bearer` prefix.
			Authorization: accessToken,
			'User-Agent': 'Difinery Storefront'
		},
		body: JSON.stringify({ query, variables }),
		cache: 'no-store'
	})

	if (res.status === 401 || res.status === 403) {
		throw new UnauthorizedError()
	}

	if (!res.ok) {
		const detail = await res.text().catch(() => '')
		throw new Error(
			`Customer Account API request failed (${res.status}): ${detail.slice(0, 300)}`
		)
	}

	const json = await res.json()

	// GraphQL reports missing scopes as a per-field error while still returning
	// the rest of the payload. Store credit in particular needs
	// customer_read_store_credit_accounts, which is off by default — so a
	// partial response must degrade, not blow up the whole page.
	if (json.errors?.length) {
		const hasData = json.data && Object.values(json.data).some(v => v != null)

		if (hasData) {
			console.warn(
				'Customer Account API partial errors:',
				json.errors.map(e => e.message).join(', ')
			)
			return json.data
		}

		const unauthorized = json.errors.some(
			e =>
				e.extensions?.code === 'UNAUTHENTICATED' ||
				e.extensions?.code === 'UNAUTHORIZED'
		)
		if (unauthorized) throw new UnauthorizedError()
		throw new Error(json.errors.map(e => e.message).join(', '))
	}

	return json.data
}

/**
 * Runs a query using the signed-in customer's token from cookies.
 * Safe to call from server components and server actions.
 *
 * Token refresh is NOT handled here — server components cannot write cookies.
 * proxy.js refreshes the session before any /account route renders.
 */
export async function customerFetch(query, variables = {}) {
	const store = await cookies()
	const accessToken = store.get(COOKIES.access)?.value
	return customerFetchWithToken(accessToken, query, variables)
}

/** Cheap check for whether a session cookie is present at all. */
export async function hasCustomerSession() {
	const store = await cookies()
	return Boolean(store.get(COOKIES.access)?.value)
}

/** Returns the raw access token, or null. */
export async function getAccessToken() {
	const store = await cookies()
	return store.get(COOKIES.access)?.value || null
}
