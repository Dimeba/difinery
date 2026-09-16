import { NextResponse } from 'next/server'

import { customerFetchWithToken } from '@/lib/customerAccount/client'
import { isConfigured } from '@/lib/customerAccount/config'
import { CUSTOMER_ME } from '@/lib/customerAccount/queries'
import { ensureAccessToken } from '@/lib/customerAccount/session'
import {
	CART_BUYER_IDENTITY_UPDATE,
	CART_DISCOUNT_CODES_UPDATE,
	storefrontFetch
} from '@/lib/storefrontServer'
import { getUbsDiscountCode, isUbsEligibleEmail } from '@/lib/ubs'

export const dynamic = 'force-dynamic'

const NO_STORE = { 'Cache-Control': 'private, no-store, max-age=0' }

/**
 * UBS staff program: applies the staff discount code when the signed-in
 * customer's verified email is on an eligible domain.
 *
 * Returns the updated cart, or null when nothing was applied. Never throws —
 * a failed discount must not undo the cart link that already succeeded.
 */
async function applyUbsDiscount(accessToken, cartId) {
	const code = getUbsDiscountCode()
	if (!code) return null

	try {
		const data = await customerFetchWithToken(accessToken, CUSTOMER_ME)
		const email = data?.customer?.emailAddress?.emailAddress
		if (!isUbsEligibleEmail(email)) return null

		const result = await storefrontFetch(CART_DISCOUNT_CODES_UPDATE, {
			cartId,
			discountCodes: [code]
		})

		const errors = result?.cartDiscountCodesUpdate?.userErrors || []
		if (errors.length) {
			console.error('cartDiscountCodesUpdate:', errors.map(e => e.message).join(', '))
			return null
		}

		return result.cartDiscountCodesUpdate.cart || null
	} catch (error) {
		console.error('UBS discount failed:', error.message)
		return null
	}
}

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

		const discountedCart = await applyUbsDiscount(accessToken, cartId)

		const ok = NextResponse.json(
			{
				linked: true,
				checkoutUrl: data.cartBuyerIdentityUpdate.cart?.checkoutUrl,
				cart: discountedCart
			},
			{ headers: NO_STORE }
		)
		for (const cookie of response.cookies.getAll()) ok.cookies.set(cookie)
		return ok
	} catch (error) {
		console.error('link-cart failed:', error.message)
		return response
	}
}
