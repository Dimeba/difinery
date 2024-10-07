'use client'

// React
import { useState, useEffect } from 'react'

// styles
import styles from './Products.module.scss'

// components
import ProductCard from './ProductCard'
import Filters from './Filters'
import { LuSettings2 } from 'react-icons/lu'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

// lib
import { getCollections, extractShopifyId } from '@/lib/shopify'

const Products = ({
	title,
	stylizedTitle,
	showTitle,
	collections,
	discount,
	recommendedProducts,
	showFilters,
	individual
}) => {
	const [items, setItems] = useState([])
	const [filteredItems, setFilteredItems] = useState([])
	const [showFiltersMenu, setShowFiltersMenu] = useState(false)

	// State variables for filters
	const [selectedSort, setSelectedSort] = useState(null)
	const [selectedProductType, setSelectedProductType] = useState('All')
	const [selectedMetalTypes, setSelectedMetalTypes] = useState([])

	useEffect(() => {
		const fetchProducts = async () => {
			const decodedIDs = []
			const data = []

			// Fetch collections (ensure getCollections is accessible on the client)
			const fetchedCollections = await getCollections()

			// Decode categories
			collections.forEach(category => {
				decodedIDs.push(extractShopifyId(category))
			})

			// Filter collections
			const content = fetchedCollections
				.filter(collection => decodedIDs.includes(collection.id))
				.reverse()

			// Extract products
			for (const item of content) {
				data.push(...item.products)
			}

			setItems(data)
			setFilteredItems(data)
		}

		if (collections) {
			fetchProducts()
		} else {
			setItems(recommendedProducts)
			setFilteredItems(recommendedProducts)
		}
	}, [collections, recommendedProducts])

	// Filter and sort logic
	useEffect(() => {
		let updatedItems = [...items]

		// Filter by product type
		if (selectedProductType && selectedProductType !== 'All') {
			updatedItems = updatedItems.filter(
				item => item.productType === selectedProductType
			)
		}

		// Filter by metal types
		if (selectedMetalTypes.length > 0) {
			updatedItems = updatedItems.filter(item =>
				item.options?.some(option =>
					option.values.some(val =>
						selectedMetalTypes.some(mt =>
							val.value.toLowerCase().includes(mt.toLowerCase())
						)
					)
				)
			)
		}

		// Apply sorting
		if (selectedSort) {
			switch (selectedSort) {
				case 'Lowest Price':
					updatedItems.sort(
						(a, b) =>
							Math.min(...a.variants.map(variant => variant.price.amount)) -
							Math.min(...b.variants.map(variant => variant.price.amount))
					)
					break
				case 'Highest Price':
					updatedItems.sort(
						(a, b) =>
							Math.max(...b.variants.map(variant => variant.price.amount)) -
							Math.max(...a.variants.map(variant => variant.price.amount))
					)
					break
				case 'Newest':
					updatedItems.sort(
						(a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
					)
					break
				default:
					break
			}
		}

		setFilteredItems(updatedItems)
	}, [items, selectedSort, selectedProductType, selectedMetalTypes])

	return (
		<section
			className='topSection'
			style={{ marginBottom: individual ? '0' : '' }}
		>
			<div className={`${!individual ? 'container' : ''} ${styles.content}`}>
				{showTitle && stylizedTitle && (
					<div className={`stylizedH3 ${styles.stylizedTitle}`}>
						{documentToReactComponents(stylizedTitle)}
					</div>
				)}
				{showTitle && title && !stylizedTitle && <h3>{title}</h3>}

				{/* Filters */}
				{showFilters && items && (
					<button
						className={styles.showFiltersButton}
						onClick={() => setShowFiltersMenu(!showFiltersMenu)}
					>
						<p>Sort & Filter</p>
						<LuSettings2 />
					</button>
				)}

				<div className={styles.productsContainer}>
					{showFiltersMenu && (
						<Filters
							items={items}
							selectedSort={selectedSort}
							setSelectedSort={setSelectedSort}
							selectedProductType={selectedProductType}
							setSelectedProductType={setSelectedProductType}
							selectedMetalTypes={selectedMetalTypes}
							setSelectedMetalTypes={setSelectedMetalTypes}
							toggleFilters={() => setShowFiltersMenu(!showFiltersMenu)}
						/>
					)}

					<div
						className={`${styles.products} ${!individual ? styles.gap : ''}`}
					>
						{filteredItems
							.filter(item => item.availableForSale)
							.map(product => (
								<ProductCard
									key={product.id}
									id={product.id}
									product={product}
									permalink={product.handle}
									discount={discount}
									individual={individual}
								/>
							))}
					</div>
				</div>
			</div>
		</section>
	)
}

export default Products
