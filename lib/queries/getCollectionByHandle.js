import { gql } from '@apollo/client'

export const GET_COLLECTION_BY_HANDLE = gql`
	query getCollectionByHandle($handle: String!) {
		collectionByHandle(handle: $handle) {
			products(first: 10) {
				edges {
					node {
						availableForSale
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
			}
		}
	}
`
