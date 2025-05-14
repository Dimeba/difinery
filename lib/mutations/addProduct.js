// src/lib/mutations/addProduct.js
import { gql } from '@apollo/client'

export const ADD_PRODUCT = gql`
	mutation AddProduct($cartId: ID!, $lines: [CartLineInput!]!) {
		cartLinesAdd(cartId: $cartId, lines: $lines) {
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
