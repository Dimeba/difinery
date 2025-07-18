import { gql } from '@apollo/client'

export const GET_PRODUCT_BY_HANDLE = gql`
	query getProductByHandle($handle: String!) {
		productByHandle(handle: $handle) {
			title
			category {
				name
			}
			description
			descriptionHtml
			images(first: 10) {
				edges {
					node {
						url
						altText
					}
				}
			}
			id
			priceRange {
				minVariantPrice {
					amount
				}
			}
			options(first: 10) {
				name
				optionValues {
					name
				}
			}
			variants(first: 250) {
				edges {
					node {
						id
						sku
						price {
							amount
						}
						selectedOptions {
							name
							value
						}
					}
				}
			}
		}
	}
`
