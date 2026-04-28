// Smart data fetching strategy for shop pages
import { apolloClient } from './apolloClient'
import { GET_PRODUCTS } from './queries/getProducts'
import { GET_COLLECTION_BY_HANDLE } from './queries/getCollectionByHandle'

const cacheOptions = {
	context: {
		fetchOptions: {
			next: { revalidate: false }
		}
	}
}

/**
 * Determine if filters are active (excluding metal which is in URL)
 * @param {Object} filters - Filter object
 */
export function hasActiveFilters(filters) {
	if (!filters) return false
	return (
		!!(filters.style && filters.style !== 'all') ||
		!!filters.shape ||
		!!filters.setting
	)
}

/**
 * Fetch all products with pagination support for large datasets
 * @param {string} category - Category handle ('all' or specific category)
 * @param {number} maxProducts - Maximum number to fetch (default: no limit)
 */
async function fetchAllProducts(category = 'all', maxProducts = null) {
	let allEdges = []
	let hasNextPage = true
	let cursor = null
	const batchSize = 250

	while (hasNextPage && (!maxProducts || allEdges.length < maxProducts)) {
		const remaining = maxProducts ? maxProducts - allEdges.length : batchSize
		const first = Math.min(batchSize, remaining)

		if (category === 'all') {
			const { data } = await apolloClient.query({
				query: GET_PRODUCTS,
				variables: { first, after: cursor },
				...cacheOptions
			})
			allEdges = [...allEdges, ...data.products.edges]
			hasNextPage = data.products.pageInfo.hasNextPage
			cursor = data.products.pageInfo.endCursor
		} else {
			const { data } = await apolloClient.query({
				query: GET_COLLECTION_BY_HANDLE,
				variables: { handle: category, first, after: cursor },
				...cacheOptions
			})
			const products = data.collectionByHandle?.products
			if (!products) break
			allEdges = [...allEdges, ...products.edges]
			hasNextPage = products.pageInfo.hasNextPage
			cursor = products.pageInfo.endCursor
		}

		if (!hasNextPage || !cursor) break
	}

	return {
		edges: allEdges,
		pageInfo: {
			hasNextPage: false,
			endCursor:
				allEdges.length > 0 ? allEdges[allEdges.length - 1].cursor : null
		}
	}
}

/**
 * Smart fetch: Get 20 products if no filters, all products if filters active
 * @param {Object} filters - Filter object
 * @param {string} category - Category handle ('all' or specific category)
 */
export async function fetchProductsSmart(filters = null, category = 'all') {
	const needsFullDataset = hasActiveFilters(filters)

	if (needsFullDataset) {
		// Fetch all products for accurate filtering
		const result = await fetchAllProducts(category)
		return {
			...result,
			hasFilters: true
		}
	}

	// Fetch only 20 for initial load
	const first = 20

	if (category === 'all') {
		const { data } = await apolloClient.query({
			query: GET_PRODUCTS,
			variables: { first, after: null },
			...cacheOptions
		})
		return {
			edges: data.products.edges,
			pageInfo: data.products.pageInfo,
			hasFilters: false
		}
	} else {
		const { data } = await apolloClient.query({
			query: GET_COLLECTION_BY_HANDLE,
			variables: { handle: category, first, after: null },
			...cacheOptions
		})
		return {
			edges: data.collectionByHandle?.products.edges || [],
			pageInfo: data.collectionByHandle?.products.pageInfo,
			hasFilters: false
		}
	}
}

/**
 * Fetch additional products for pagination
 * @param {string} cursor - Last cursor from pageInfo
 * @param {string} category - Category handle
 */
export async function fetchMoreProducts(cursor, category = 'all') {
	const first = 20

	if (category === 'all') {
		const { data } = await apolloClient.query({
			query: GET_PRODUCTS,
			variables: { first, after: cursor },
			...cacheOptions
		})
		return data.products
	} else {
		const { data } = await apolloClient.query({
			query: GET_COLLECTION_BY_HANDLE,
			variables: { handle: category, first, after: cursor },
			...cacheOptions
		})
		return data.collectionByHandle?.products
	}
}
