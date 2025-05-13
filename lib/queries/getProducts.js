import { gql } from '@apollo/client'

export const GET_PRODUCTS = gql`
	query GetProducts {
		products(first: 250) {
			edges {
				node {
					handle
					id
				}
			}
		}
	}
`
