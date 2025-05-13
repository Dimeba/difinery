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

// Apollo
import { apolloClient } from '@/lib/apolloClient'
import { GET_COLLECTION_BY_HANDLE } from '@/lib/queries/getCollectionByHandle'

const Products = ({
	title,
	stylizedTitle,
	showTitle,
	collections, // array of Shopify handles as strings
	discount,
	recommendedProducts,
	showFilters,
	individual
}) => {
	const [items, setItems] = useState([])
	const [filteredItems, setFilteredItems] = useState([])
	const [showFiltersMenu, setShowFiltersMenu] = useState(false)

	// filters state
	const [selectedSort, setSelectedSort] = useState(null)
	const [selectedProductType, setSelectedProductType] = useState('All')
	const [selectedMetalTypes, setSelectedMetalTypes] = useState([])

	// loading / error
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		if (!collections) {
			// fallback to recommended
			setItems(recommendedProducts)
			setFilteredItems(recommendedProducts)
			return
		}

		const fetchProducts = async () => {
			setLoading(true)
			setError(null)
			try {
				const allProducts = []
				// for each handle, fetch that collection
				for (const handle of collections) {
					const { data } = await apolloClient.query({
						query: GET_COLLECTION_BY_HANDLE,
						variables: { handle }
					})
					const edges = data.collectionByHandle?.products?.edges || []
					// pull out the node from each edge
					const products = edges.map(edge => edge.node)
					allProducts.push(...products)
				}
				// reverse order if you care about most‐recent handle first
				allProducts.reverse()

				setItems(allProducts)
				setFilteredItems(allProducts)
			} catch (err) {
				setError(err)
			} finally {
				setLoading(false)
			}
		}

		fetchProducts()
	}, [collections, recommendedProducts])

	// Filter & sort
	useEffect(() => {
		let updated = [...items]

		if (selectedProductType !== 'All') {
			updated = updated.filter(p => p.productType === selectedProductType)
		}

		if (selectedMetalTypes.length) {
			updated = updated.filter(p =>
				p.options?.some(opt =>
					opt.values.some(value =>
						selectedMetalTypes.some(mt =>
							value.toLowerCase().includes(mt.toLowerCase())
						)
					)
				)
			)
		}

		if (selectedSort) {
			switch (selectedSort) {
				case 'Lowest Price':
					updated.sort(
						(a, b) =>
							+a.priceRange.minVariantPrice.amount -
							+b.priceRange.minVariantPrice.amount
					)
					break
				case 'Highest Price':
					updated.sort(
						(a, b) =>
							+b.priceRange.minVariantPrice.amount -
							+a.priceRange.minVariantPrice.amount
					)
					break
				case 'Newest':
					updated.sort(
						(a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
					)
					break
			}
		}

		setFilteredItems(updated)
	}, [items, selectedSort, selectedProductType, selectedMetalTypes])

	// show loading / error
	if (loading) return <p>Loading…</p>
	if (error) return <p>Error: {error.message}</p>

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

				{/* Filters toggle */}
				{showFilters && items.length > 0 && (
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
							// .filter(item => item.availableForSale)
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
