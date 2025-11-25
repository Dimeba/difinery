// Data fetching helpers with built-in caching
import { apolloClient } from './apolloClient'
import { GET_PRODUCTS } from './queries/getProducts'
import { GET_PRODUCT_BY_HANDLE } from './queries/getProductByHandle'
import { GET_COLLECTION_BY_HANDLE } from './queries/getCollectionByHandle'
import { getEntries } from './contentful'

// Cached fetch options for Apollo queries
const cacheOptions = {
	context: {
		fetchOptions: {
			next: { revalidate: 3600 } // Cache for 1 hour
		}
	}
}

/**
 * Fetch all products with caching
 * @param {number} first - Number of products to fetch
 * @param {string} after - Cursor for pagination
 */
export async function fetchProducts(first = 250, after = null) {
	const { data } = await apolloClient.query({
		query: GET_PRODUCTS,
		variables: { first, after },
		...cacheOptions
	})
	return data.products
}

/**
 * Fetch a single product by handle with caching
 * @param {string} handle - Product handle
 */
export async function fetchProductByHandle(handle) {
	const { data } = await apolloClient.query({
		query: GET_PRODUCT_BY_HANDLE,
		variables: { handle },
		...cacheOptions
	})
	return data.productByHandle
}

/**
 * Fetch a collection by handle with caching
 * @param {string} handle - Collection handle
 * @param {number} first - Number of products to fetch
 * @param {string} after - Cursor for pagination
 */
export async function fetchCollectionByHandle(
	handle,
	first = 250,
	after = null
) {
	const { data } = await apolloClient.query({
		query: GET_COLLECTION_BY_HANDLE,
		variables: { handle, first, after },
		...cacheOptions
	})
	return data.collectionByHandle
}

/**
 * Fetch Contentful shop page content with caching
 */
export async function fetchShopPageContent() {
	const pages = await getEntries('page')
	return pages.items.find(page => page.fields.title == 'Shop')?.fields || {}
}

/**
 * Fetch product page FAQs with caching
 */
export async function fetchProductPageFAQs() {
	const allFaqs = await getEntries('accordion')
	return (
		allFaqs.items.find(item => item.fields.productPage === 'Yes') || {
			fields: { rows: [] }
		}
	)
}

/**
 * Fetch all Contentful collections with caching
 */
export async function fetchContentfulCollections() {
	return await getEntries('collection')
}
