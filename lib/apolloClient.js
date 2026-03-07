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
			Collection: {
				// Some Shopify collection payloads omit id; avoid normalization conflicts.
				keyFields: false
			},
			Query: {
				fields: {
					collectionByHandle: {
						keyArgs: ['handle'],
						merge(existing = {}, incoming = {}, { mergeObjects }) {
							return mergeObjects(existing, incoming)
						}
					},
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
