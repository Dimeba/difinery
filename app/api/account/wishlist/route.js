import { NextResponse } from 'next/server'

import {
	customerFetchWithToken,
	UnauthorizedError
} from '@/lib/customerAccount/client'
import { isConfigured } from '@/lib/customerAccount/config'
import { CUSTOMER_WISHLIST, METAFIELDS_SET } from '@/lib/customerAccount/queries'
import { ensureAccessToken } from '@/lib/customerAccount/session'

export const dynamic = 'force-dynamic'

const NO_STORE = { 'Cache-Control': 'private, no-store, max-age=0' }

// Matches the metafield definition that has to exist in Shopify admin:
// Customers → custom.wishlist, type "List of product references",
// Customer Account API access: Read and write.
const NAMESPACE = 'custom'
const KEY = 'wishlist'
const TYPE = 'list.product_reference'

// metafieldsSet accepts at most 25 metafields per call; the cap here is on the
// number of product ids inside the single list value, kept sane on purpose.
const MAX_ITEMS = 250

function parseIds(value) {
	if (!value) return []
	try {
		const parsed = JSON.parse(value)
		return Array.isArray(parsed) ? parsed.filter(id => typeof id === 'string') : []
	} catch {
		return []
	}
}

function sanitize(ids) {
	if (!Array.isArray(ids)) return []
	const seen = new Set()
	const out = []
	for (const id of ids) {
		if (typeof id !== 'string') continue
		if (!id.startsWith('gid://shopify/Product/')) continue
		if (seen.has(id)) continue
		seen.add(id)
		out.push(id)
		if (out.length >= MAX_ITEMS) break
	}
	return out
}

async function readWishlist(accessToken) {
	const data = await customerFetchWithToken(accessToken, CUSTOMER_WISHLIST)
	return {
		customerId: data?.customer?.id,
		ids: parseIds(data?.customer?.metafield?.value)
	}
}

async function writeWishlist(accessToken, customerId, ids) {
	const data = await customerFetchWithToken(accessToken, METAFIELDS_SET, {
		metafields: [
			{
				ownerId: customerId,
				namespace: NAMESPACE,
				key: KEY,
				type: TYPE,
				value: JSON.stringify(ids)
			}
		]
	})

	const errors = data?.metafieldsSet?.userErrors || []
	if (errors.length) {
		throw new Error(errors.map(e => e.message).join(', '))
	}
	return ids
}

export async function GET(request) {
	if (!isConfigured()) {
		return NextResponse.json({ ids: [] }, { headers: NO_STORE })
	}

	const response = NextResponse.json({ ids: [] }, { headers: NO_STORE })
	const accessToken = await ensureAccessToken(request, response)
	if (!accessToken) return response

	try {
		const { ids } = await readWishlist(accessToken)
		const ok = NextResponse.json({ ids }, { headers: NO_STORE })
		for (const cookie of response.cookies.getAll()) ok.cookies.set(cookie)
		return ok
	} catch (error) {
		if (error instanceof UnauthorizedError) return response
		console.error('wishlist GET failed:', error.message)
		return NextResponse.json(
			{ ids: [], error: 'read-failed' },
			{ status: 500, headers: NO_STORE }
		)
	}
}

/**
 * Body: { ids: string[], merge?: boolean }
 * `merge` unions with what is already stored — used once after sign-in to fold
 * in the wishlist a guest built up in localStorage.
 */
export async function PUT(request) {
	if (!isConfigured()) {
		return NextResponse.json(
			{ ids: [], error: 'not-configured' },
			{ status: 503, headers: NO_STORE }
		)
	}

	let body
	try {
		body = await request.json()
	} catch {
		return NextResponse.json(
			{ error: 'invalid-body' },
			{ status: 400, headers: NO_STORE }
		)
	}

	const incoming = sanitize(body?.ids)

	const response = NextResponse.json({ ids: [] }, { headers: NO_STORE })
	const accessToken = await ensureAccessToken(request, response)
	if (!accessToken) {
		return NextResponse.json(
			{ error: 'unauthorized' },
			{ status: 401, headers: NO_STORE }
		)
	}

	try {
		const { customerId, ids: existing } = await readWishlist(accessToken)
		if (!customerId) {
			return NextResponse.json(
				{ error: 'unauthorized' },
				{ status: 401, headers: NO_STORE }
			)
		}

		const next = body?.merge
			? sanitize([...existing, ...incoming])
			: incoming

		await writeWishlist(accessToken, customerId, next)

		const ok = NextResponse.json({ ids: next }, { headers: NO_STORE })
		for (const cookie of response.cookies.getAll()) ok.cookies.set(cookie)
		return ok
	} catch (error) {
		if (error instanceof UnauthorizedError) {
			return NextResponse.json(
				{ error: 'unauthorized' },
				{ status: 401, headers: NO_STORE }
			)
		}
		console.error('wishlist PUT failed:', error.message)
		return NextResponse.json(
			{ error: 'write-failed' },
			{ status: 500, headers: NO_STORE }
		)
	}
}
