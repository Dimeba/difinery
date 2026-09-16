// Minimal server-side Storefront API client.
//
// lib/apolloClient.js is a shared singleton with an InMemoryCache; these calls
// are per-customer and must never be cached, so they use a plain fetch.
// Keep the API version in sync with lib/apolloClient.js.

const API_VERSION = '2025-07'

export async function storefrontFetch(query, variables = {}) {
	const res = await fetch(
		`https://${process.env.domain}/api/${API_VERSION}/graphql.json`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Storefront-Access-Token': process.env.token
			},
			body: JSON.stringify({ query, variables }),
			cache: 'no-store'
		}
	)

	if (!res.ok) {
		const detail = await res.text().catch(() => '')
		throw new Error(
			`Storefront API request failed (${res.status}): ${detail.slice(0, 300)}`
		)
	}

	const json = await res.json()
	if (json.errors?.length) {
		throw new Error(json.errors.map(e => e.message).join(', '))
	}
	return json.data
}

/**
 * Attaches a signed-in customer to a cart. Since API version 2025-04 the
 * Storefront API accepts a Customer Account API access token directly here —
 * the old storefrontCustomerAccessTokenCreate exchange is no longer needed.
 */
export const CART_BUYER_IDENTITY_UPDATE = `
	mutation CartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
		cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
			cart {
				id
				checkoutUrl
				buyerIdentity {
					email
					customer { id }
				}
			}
			userErrors { field message }
		}
	}
`

/**
 * Applies discount codes to a cart. Returns the same cart shape as the client
 * mutations in lib/mutations/, so CartContext can drop it straight into state.
 */
export const CART_DISCOUNT_CODES_UPDATE = `
	mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
		cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
			cart {
				id
				checkoutUrl
				discountCodes { code applicable }
				cost {
					totalAmount { amount currencyCode }
				}
				lines(first: 10) {
					edges {
						node {
							id
							quantity
							attributes { key value }
							merchandise {
								... on ProductVariant {
									id
									title
									priceV2 { amount currencyCode }
									image { url altText }
									product {
										title
										handle
										category { name }
									}
									selectedOptions { name value }
								}
							}
						}
					}
				}
			}
			userErrors { field message }
		}
	}
`

/** Fetches full products for a list of product GIDs (wishlist rendering). */
export const PRODUCTS_BY_IDS = `
	query ProductsByIds($ids: [ID!]!) {
		nodes(ids: $ids) {
			... on Product {
				id
				title
				handle
				availableForSale
				category { name }
				images(first: 2) {
					edges { node { url altText } }
				}
				priceRange {
					minVariantPrice { amount currencyCode }
				}
				variants(first: 1) {
					edges { node { id } }
				}
			}
		}
	}
`
