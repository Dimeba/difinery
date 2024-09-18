'use client'

// React
import { useState, useEffect } from 'react'

// styles
import styles from './Products.module.scss'

// components
import ProductCard from './ProductCard'
import Filters from './Filters'
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
	showFilters
}) => {
	const [items, setItems] = useState([])
	const [filteredItems, setFilteredItems] = useState([])

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
	}, [])

	return (
		<section className='topSection'>
			<div className={`container ${styles.content}`}>
				{showTitle && stylizedTitle && (
					<div className={`stylizedH3 ${styles.stylizedTitle}`}>
						{documentToReactComponents(stylizedTitle)}
					</div>
				)}
				{showTitle && title && !stylizedTitle && <h3>{title}</h3>}

				{/* Filters */}
				{showFilters && items && (
					<Filters items={items} setFilteredItems={setFilteredItems} />
				)}

				<div className={styles.products}>
					{filteredItems
						.filter(item => item.availableForSale)
						.map(product => (
							<ProductCard
								key={product.id}
								id={product.id}
								product={product}
								permalink={product.handle}
								discount={discount}
							/>
						))}
				</div>
			</div>
		</section>
	)
}

export default Products
