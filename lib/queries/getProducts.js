import { gql } from '@apollo/client'

export const GET_PRODUCTS = gql`
	query GetProducts($first: Int!, $after: String) {
		products(
			first: $first
			after: $after
			query: "-product_type:'gift card' -product_type:'engraving' -product_type:'custom box'"
		) {
			pageInfo {
				hasNextPage
				endCursor
			}
			edges {
				cursor
				node {
					availableForSale
					id
					title
					handle
					category {
						name
					}
					images(first: 20) {
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
		}
	}
`
