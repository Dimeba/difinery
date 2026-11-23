import { gql } from '@apollo/client'

// Replaces all cart-level attributes (not line attributes).
export const UPDATE_CART_ATTRIBUTES = gql`
	mutation CartAttributesUpdate($cartId: ID!, $attributes: [AttributeInput!]!) {
		cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
			cart {
				id
			}
			userErrors {
				field
				message
			}
		}
	}
`
