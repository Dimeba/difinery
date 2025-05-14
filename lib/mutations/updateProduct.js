// src/lib/mutations/updateProduct.js
import { gql } from '@apollo/client'

export const UPDATE_PRODUCT = gql`
	mutation UpdateProduct($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
		cartLinesUpdate(cartId: $cartId, lines: $lines) {
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
