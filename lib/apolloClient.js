import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const apiUrl = `https://${process.env.domain}/api/2025-07/graphql.json`

// 15-second timeout on every Shopify Storefront API request.
// Without this, a hung request stalls static generation indefinitely and
// eventually triggers Netlify's 18-minute build timeout.
const fetchWithTimeout = (url, options = {}) => {
	const controller = new AbortController()
	const timer = setTimeout(() => controller.abort(), 15_000)
	return fetch(url, { ...options, signal: controller.signal }).finally(() =>
		clearTimeout(timer)
	)
}

export const apolloClient = new ApolloClient({
	link: new HttpLink({
		uri: apiUrl,
		fetch: fetchWithTimeout,
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
