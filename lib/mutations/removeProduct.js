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
							attributes {
								key
								value
							}
							merchandise {
								... on ProductVariant {
									id
									title
									selectedOptions {
										name
										value
									}
									priceV2 {
										amount
										currencyCode
									}
									image {
										url
										altText
									}
									product {
										id
										title
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
