// src/lib/mutations/removeProduct.js
import { gql } from '@apollo/client'

export const REMOVE_PRODUCT = gql`
	mutation RemoveProduct($cartId: ID!, $lineIds: [ID!]!) {
		cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
			cart {
				id
				checkoutUrl
				cost {
					totalAmount {
						amount
						currencyCode
					}
				}
				lines(first: 10) {
					edges {
						node {
							id
							quantity
							merchandise {
								... on ProductVariant {
									id
									title
									priceV2 {
										amount
										currencyCode
									}
									image {
										url
										altText
									}
								}
							}
							attributes {
								key
								value
							}
						}
					}
				}
			}
			userErrors {
				field
				message
			}
		}
	}
`
