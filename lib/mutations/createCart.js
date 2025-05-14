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
					}
				}
				lines(first: 10) {
					edges {
						node {
							id
							quantity
							cost {
								totalAmount {
									amount
								}
							}
						}
					}
				}
			}
		}
	}
`
