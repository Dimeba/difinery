import { gql } from '@apollo/client'

export const GET_PRODUCT_RECOMMENDATIONS = gql`
	query getProductRecommendations($productHandle: String!) {
		productRecommendations(productHandle: $productHandle) {
			id
			title
			handle
			category {
				name
			}
			images(first: 2) {
				edges {
					node {
						url
						altText
					}
				}
			}
			options(first: 10) {
				name
				values
			}
			priceRange {
				minVariantPrice {
					amount
				}
			}
		}
	}
`
