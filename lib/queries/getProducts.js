import { gql } from '@apollo/client'

// Base Shopify search filter: hide non-jewelry helper products.
export const PRODUCTS_BASE_QUERY =
	"-product_type:'gift card' -product_type:'engraving' -product_type:'custom box'"

// Shop listing filter: additionally hide products tagged "Chain".
export const PRODUCTS_LISTING_QUERY = `${PRODUCTS_BASE_QUERY} -tag:'Chain'`

export const GET_PRODUCTS = gql`
	query GetProducts(
		$first: Int!
		$after: String
		$query: String = "${PRODUCTS_BASE_QUERY}"
	) {
		products(first: $first, after: $after, query: $query) {
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
					tags
					category {
						name
					}
					images(first: 150) {
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
