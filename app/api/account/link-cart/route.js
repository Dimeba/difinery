import { NextResponse } from 'next/server'

import { isConfigured } from '@/lib/customerAccount/config'
import { ensureAccessToken } from '@/lib/customerAccount/session'
import {
	CART_BUYER_IDENTITY_UPDATE,
	storefrontFetch
} from '@/lib/storefrontServer'

export const dynamic = 'force-dynamic'

const NO_STORE = { 'Cache-Control': 'private, no-store, max-age=0' }

/**
 * Attaches the signed-in customer to a Storefront cart so checkout is
 * prefilled and the order lands on their account.
 *
 * The access token is httpOnly, so the browser cannot do this itself — the
 * client only sends the cart id and the token stays server side.
 */
export async function POST(request) {
	if (!isConfigured()) {
		return NextResponse.json({ linked: false }, { headers: NO_STORE })
	}

	let cartId
	try {
		({ cartId } = await request.json())
	} catch {
		return NextResponse.json(
			{ linked: false, error: 'invalid-body' },
			{ status: 400, headers: NO_STORE }
		)
	}

	if (!cartId || typeof cartId !== 'string') {
		return NextResponse.json(
			{ linked: false, error: 'missing-cart-id' },
			{ status: 400, headers: NO_STORE }
		)
	}

	const response = NextResponse.json({ linked: false }, { headers: NO_STORE })
	const accessToken = await ensureAccessToken(request, response)
	if (!accessToken) return response

	try {
		const data = await storefrontFetch(CART_BUYER_IDENTITY_UPDATE, {
			cartId,
			buyerIdentity: { customerAccessToken: accessToken }
		})

		const errors = data?.cartBuyerIdentityUpdate?.userErrors || []
		if (errors.length) {
			console.error('cartBuyerIdentityUpdate:', errors.map(e => e.message).join(', '))
			return response
		}

		const ok = NextResponse.json(
			{ linked: true, checkoutUrl: data.cartBuyerIdentityUpdate.cart?.checkoutUrl },
			{ headers: NO_STORE }
		)
		for (const cookie of response.cookies.getAll()) ok.cookies.set(cookie)
		return ok
	} catch (error) {
		console.error('link-cart failed:', error.message)
		return response
	}
}
