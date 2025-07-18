import { gql } from '@apollo/client'

export const GET_COLLECTION_BY_HANDLE = gql`
	query getCollectionByHandle($handle: String!, $first: Int!, $after: String) {
		collectionByHandle(handle: $handle) {
			products(first: $first, after: $after) {
				pageInfo {
					hasNextPage
					endCursor
				}
				edges {
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
	}
`
