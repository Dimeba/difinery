import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const apiUrl = `https://${process.env.domain}/api/2025-07/graphql.json`

export const apolloClient = new ApolloClient({
	link: new HttpLink({
		uri: apiUrl,
		headers: {
			'X-Shopify-Storefront-Access-Token': process.env.token,
			'Content-Type': 'application/json'
		}
	}),
	cache: new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					products: {
						keyArgs: ['query'],
						merge(existing, incoming) {
							return incoming
						}
					}
				}
			}
		}
	}),
	defaultOptions: {
		query: {
			fetchPolicy: 'cache-first',
			errorPolicy: 'all'
		}
	}
})
