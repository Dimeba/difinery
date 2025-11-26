'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Products from './Products'
import { Box, Skeleton, Typography } from '@mui/material'

/**
 * Smart Products Wrapper - Fetches more data when filters are applied or when load more is clicked
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
	const [pageInfo, setPageInfo] = useState(initialPageInfo)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [hasLoadedFull, setHasLoadedFull] = useState(false)
	const [isSearching, setIsSearching] = useState(false)
	const searchTimeoutRef = useRef(null)
	const pendingSearchRef = useRef(false)

	// Check if filters are active (excluding metal which is in URL)
	const hasActiveFilters =
		(filters?.style && filters.style !== 'all') ||
		filters?.shape ||
		filters?.setting

	// Handle search - load all products when searching (immediate)
	const handleSearch = useCallback(
		async searchTerm => {
			if (!searchTerm) {
				return
			}

			// If we already have all products loaded, skip fetching
			if (hasLoadedFull) return

			// If currently loading, skip
			if (isSearching) return

			setIsSearching(true)
			setIsLoadingMore(true)
			try {
				// Fetch full dataset
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
				console.error('Error loading products for search:', error)
			} finally {
				setIsLoadingMore(false)
				setIsSearching(false)
			}
		},
		[category, hasLoadedFull, isSearching]
	)

	// Function to load more products via pagination
	const loadMoreProducts = useCallback(async () => {
		if (!pageInfo?.hasNextPage || isLoadingMore || hasActiveFilters) {
			return
		}

		setIsLoadingMore(true)
		try {
			const url =
				category === 'all'
					? `/api/products?first=20&after=${pageInfo.endCursor}`
					: `/api/collections/${category}?first=20&after=${pageInfo.endCursor}`

			const response = await fetch(url)
			const data = await response.json()

			if (category === 'all') {
				const newEdges = data.edges || []
				const newProducts = newEdges.map(edge => edge.node)
				setProducts(prev => {
					// Filter out duplicates by ID
					const existingIds = new Set(prev.map(p => p.id))
					const uniqueNew = newProducts.filter(p => !existingIds.has(p.id))
					return [...prev, ...uniqueNew]
				})
				setPageInfo(data.pageInfo)
			} else {
				const newEdges = data.products?.edges || []
				const newProducts = newEdges.map(edge => edge.node)
				setProducts(prev => {
					// Filter out duplicates by ID
					const existingIds = new Set(prev.map(p => p.id))
					const uniqueNew = newProducts.filter(p => !existingIds.has(p.id))
					return [...prev, ...uniqueNew]
				})
				setPageInfo(data.products?.pageInfo)
			}
		} catch (error) {
			console.error('Error loading more products:', error)
		} finally {
			setIsLoadingMore(false)
		}
	}, [pageInfo, isLoadingMore, hasActiveFilters, category])

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
		<Products
			products={products}
			initialPageInfo={pageInfo}
			productType={productType}
			selectedMetalType={selectedMetalType}
			showFilters={showFilters}
			filters={filters}
			onLoadMore={loadMoreProducts}
			canLoadMore={pageInfo?.hasNextPage && !hasActiveFilters}
			onSearch={handleSearch}
			isSearching={isSearching}
			{...otherProps}
		/>
	)
}
