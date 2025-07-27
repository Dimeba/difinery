import { gql } from '@apollo/client'

export const CREATE_CART = gql`
	mutation CartCreate {
		cartCreate {
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
									priceV2 {
										amount
										currencyCode
									}
									image {
										url
										altText
									}
									product {
										title
									}
									selectedOptions {
										name
										value
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
