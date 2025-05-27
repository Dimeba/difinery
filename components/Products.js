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

const Products = ({
	title = '',
	stylizedTitle,
	showTitle = false,
	discount,
	recommendedProducts,
	showFilters = false,
	individual = false,
	products = []
}) => {
	const [items, setItems] = useState(products)
	const [filteredItems, setFilteredItems] = useState(products)
	const [showFiltersMenu, setShowFiltersMenu] = useState(false)

	// filters state
	const [selectedSort, setSelectedSort] = useState(null)
	const [selectedProductType, setSelectedProductType] = useState('All')
	const [selectedMetalTypes, setSelectedMetalTypes] = useState([])

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
						{!recommendedProducts &&
							filteredItems
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

						{/* {recommendedProducts &&
							recommendedProducts.length > 0 &&
							recommendedProducts.map(product => (
								<ProductCard
									key={product.id}
									id={product.id}
									product={product}
									permalink={product.handle}
									discount={discount}
									individual={individual}
								/>
							))} */}
					</div>
				</div>
			</div>
		</section>
	)
}

export default Products
