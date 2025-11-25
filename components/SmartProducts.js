'use client'

import { useState, useEffect } from 'react'
import Products from './Products'

/**
 * Smart Products Wrapper - Fetches more data when filters are applied
 */
export default function SmartProducts({
	initialProducts,
	initialPageInfo,
	productType,
	selectedMetalType,
	showFilters,
	filters,
	category,
	...otherProps
}) {
	const [products, setProducts] = useState(initialProducts)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [hasLoadedFull, setHasLoadedFull] = useState(false)

	// Check if filters are active (excluding metal which is in URL)
	const hasActiveFilters =
		(filters?.style && filters.style !== 'all') ||
		filters?.shape ||
		filters?.setting

	// When filters change and we haven't loaded full dataset, fetch all products
	useEffect(() => {
		async function loadFullDataset() {
			// Only load if filters are active and we haven't loaded full dataset yet
			if (
				!hasActiveFilters ||
				hasLoadedFull ||
				isLoadingMore ||
				initialProducts.length >= 50 // If we already have many products, assume it's full
			) {
				return
			}

			setIsLoadingMore(true)
			try {
				// Fetch full dataset with pagination
				let allProducts = []
				let hasNextPage = true
				let cursor = null
				const batchSize = 250

				while (hasNextPage) {
					const url =
						category === 'all'
							? `/api/products?first=${batchSize}${
									cursor ? `&after=${cursor}` : ''
							  }`
							: `/api/collections/${category}?first=${batchSize}${
									cursor ? `&after=${cursor}` : ''
							  }`

					const response = await fetch(url)
					const data = await response.json()

					if (category === 'all') {
						const edges = data.edges || []
						allProducts = [...allProducts, ...edges.map(edge => edge.node)]
						hasNextPage = data.pageInfo?.hasNextPage || false
						cursor = data.pageInfo?.endCursor
					} else {
						const edges = data.products?.edges || []
						allProducts = [...allProducts, ...edges.map(edge => edge.node)]
						hasNextPage = data.products?.pageInfo?.hasNextPage || false
						cursor = data.products?.pageInfo?.endCursor
					}

					if (!hasNextPage || !cursor) break
				}

				setProducts(allProducts)
				setHasLoadedFull(true)
			} catch (error) {
				console.error('Error loading full dataset:', error)
			} finally {
				setIsLoadingMore(false)
			}
		}

		loadFullDataset()
	}, [
		hasActiveFilters,
		hasLoadedFull,
		isLoadingMore,
		category,
		initialProducts.length
	])

	return (
		<>
			{isLoadingMore && (
				<div style={{ textAlign: 'center', padding: '1rem' }}>
					Loading more products for filtering...
				</div>
			)}
			<Products
				products={products}
				initialPageInfo={initialPageInfo}
				productType={productType}
				selectedMetalType={selectedMetalType}
				showFilters={showFilters}
				filters={filters}
				{...otherProps}
			/>
		</>
	)
}
