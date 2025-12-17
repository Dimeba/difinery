import { gql } from '@apollo/client'

export const GET_PRODUCT_BY_HANDLE = gql`
	query getProductByHandle($handle: String!) {
		productByHandle(handle: $handle) {
			title
			tags
			category {
				name
			}
			description
			descriptionHtml
			images(first: 250) {
				edges {
					node {
						url
						altText
						height
						width
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
						title
						sku
						price {
							amount
						}
						selectedOptions {
							name
							value
						}
						image {
							url
							altText
						}
					}
				}
			}
			metafield(key: "pair_it_with", namespace: "custom") {
				value
			}
			collections(first: 10) {
				edges {
					node {
						title
						handle
					}
				}
			}
		}
	}
`
