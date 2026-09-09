// GraphQL documents for the Shopify Customer Account API.
//
// Plain template strings, not gql`` — these go through customerFetch(), not Apollo.

const MONEY = `
	fragment Money on MoneyV2 {
		amount
		currencyCode
	}
`

const ADDRESS_FIELDS = `
	fragment AddressFields on CustomerAddress {
		id
		firstName
		lastName
		company
		address1
		address2
		city
		zoneCode
		territoryCode
		zip
		phoneNumber
		formatted(withName: true)
	}
`

/** Header / dashboard summary. */
export const CUSTOMER_OVERVIEW = `
	${MONEY}
	${ADDRESS_FIELDS}
	query CustomerOverview {
		customer {
			id
			firstName
			lastName
			displayName
			emailAddress { emailAddress }
			phoneNumber { phoneNumber }
			defaultAddress { ...AddressFields }
			orders(first: 3, sortKey: PROCESSED_AT, reverse: true) {
				nodes {
					id
					name
					processedAt
					financialStatus
					totalPrice { ...Money }
				}
			}
			metafield(namespace: "custom", key: "wishlist") { value }
		}
	}
`

/**
 * Kept separate from CUSTOMER_OVERVIEW on purpose.
 *
 * Customer.storeCreditAccounts is a NON-NULL connection and needs the
 * customer_read_store_credit_accounts scope. Without that scope GraphQL nulls
 * the field, and because it is non-null the null propagates up and wipes out
 * the whole `customer` object — taking the entire dashboard query with it.
 * Isolating it means a missing scope costs one card, not the page.
 */
export const CUSTOMER_STORE_CREDIT = `
	query CustomerStoreCredit {
		customer {
			storeCreditAccounts(first: 10) {
				nodes {
					id
					balance { amount currencyCode }
				}
			}
		}
	}
`

/** Minimal payload for /api/account/me. */
export const CUSTOMER_ME = `
	query CustomerMe {
		customer {
			id
			firstName
			lastName
			displayName
			emailAddress { emailAddress }
		}
	}
`

export const CUSTOMER_ORDERS = `
	${MONEY}
	query CustomerOrders($first: Int!, $after: String) {
		customer {
			orders(first: $first, after: $after, sortKey: PROCESSED_AT, reverse: true) {
				pageInfo { hasNextPage endCursor }
				nodes {
					id
					name
					processedAt
					financialStatus
					totalPrice { ...Money }
					lineItems(first: 3) {
						nodes {
							title
							quantity
							image { url altText }
						}
					}
				}
			}
		}
	}
`

export const CUSTOMER_ORDER = `
	${MONEY}
	${ADDRESS_FIELDS}
	query CustomerOrder($id: ID!) {
		customer {
			order(id: $id) {
				id
				name
				processedAt
				financialStatus
				statusPageUrl
				totalPrice { ...Money }
				subtotal { ...Money }
				totalShipping { ...Money }
				totalTax { ...Money }
				shippingAddress { ...AddressFields }
				lineItems(first: 100) {
					nodes {
						id
						title
						variantTitle
						quantity
						image { url altText }
						totalPrice { ...Money }
						customAttributes { key value }
					}
				}
				fulfillments(first: 10) {
					nodes {
						status
						trackingInformation { company number url }
					}
				}
				returnInformation {
					returnableLineItems(first: 50) {
						nodes {
							quantity
							lineItem {
								id
								title
								variantTitle
								image { url altText }
							}
						}
					}
				}
			}
		}
	}
`

export const CUSTOMER_ADDRESSES = `
	${ADDRESS_FIELDS}
	query CustomerAddresses {
		customer {
			defaultAddress { id }
			addresses(first: 30) {
				nodes { ...AddressFields }
			}
		}
	}
`

export const CUSTOMER_WISHLIST = `
	query CustomerWishlist {
		customer {
			id
			metafield(namespace: "custom", key: "wishlist") { value }
		}
	}
`

/* ---------------------------------- mutations --------------------------------- */

export const CUSTOMER_UPDATE = `
	mutation CustomerUpdate($input: CustomerUpdateInput!) {
		customerUpdate(input: $input) {
			customer { id firstName lastName }
			userErrors { field message }
		}
	}
`

export const ADDRESS_CREATE = `
	mutation AddressCreate($address: CustomerAddressInput!, $defaultAddress: Boolean) {
		customerAddressCreate(address: $address, defaultAddress: $defaultAddress) {
			customerAddress { id }
			userErrors { field message }
		}
	}
`

export const ADDRESS_UPDATE = `
	mutation AddressUpdate($addressId: ID!, $address: CustomerAddressInput!, $defaultAddress: Boolean) {
		customerAddressUpdate(addressId: $addressId, address: $address, defaultAddress: $defaultAddress) {
			customerAddress { id }
			userErrors { field message }
		}
	}
`

export const ADDRESS_DELETE = `
	mutation AddressDelete($addressId: ID!) {
		customerAddressDelete(addressId: $addressId) {
			deletedAddressId
			userErrors { field message }
		}
	}
`

export const METAFIELDS_SET = `
	mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
		metafieldsSet(metafields: $metafields) {
			metafields { key value }
			userErrors { field message }
		}
	}
`

// RequestedLineItemInput in 2026-07 takes lineItemId / quantity / customerNote
// (plus an optional returnReasonDefinitionId we don't use — the shopper's
// reason is folded into customerNote instead so the merchant still sees it).
export const ORDER_REQUEST_RETURN = `
	mutation OrderRequestReturn($orderId: ID!, $requestedLineItems: [RequestedLineItemInput!]!) {
		orderRequestReturn(orderId: $orderId, requestedLineItems: $requestedLineItems) {
			return { id }
			userErrors { field message }
		}
	}
`
