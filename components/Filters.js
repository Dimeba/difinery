'use client'

// styles
import styles from './Filters.module.scss'

// components
import { LuSettings2 } from 'react-icons/lu'

// hooks
import { useState } from 'react'

const Filters = ({ items, setFilteredItems }) => {
	const [showFilters, setShowFilters] = useState(false)

	const handeShowFilters = () => {
		setShowFilters(!showFilters)
	}

	const handleFilter = () => {
		setFilteredItems([...items].filter(item => item.productType === 'Ring'))
	}

	const handleCancel = () => {
		setFilteredItems([...items])
	}

	// Sorting Methods

	const handleSortByLowestPrice = () => {
		setFilteredItems(
			[...items].sort(
				(a, b) =>
					Math.min(...a.variants.map(variant => variant.price.amount)) -
					Math.min(...b.variants.map(variant => variant.price.amount))
			)
		)
	}

	const handleSortByHighestPrice = () => {
		setFilteredItems(
			[...items].sort(
				(a, b) =>
					Math.max(...b.variants.map(variant => variant.price.amount)) -
					Math.max(...a.variants.map(variant => variant.price.amount))
			)
		)
	}

	const handleSortByNewest = () => {
		setFilteredItems(
			[...items].sort(
				(a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
			)
		)
	}

	// console.log(items[0])

	return (
		<div className={`container ${styles.filtersContainer}`}>
			<button className={styles.showFiltersButton} onClick={handeShowFilters}>
				<p>Filter & Sort</p>
				<LuSettings2 />
			</button>

			{showFilters && (
				<div>
					<div>
						<h4>Filter</h4>
						<button onClick={handleFilter}>Filters</button>
						<button onClick={handleCancel}>Cancel</button>
					</div>
					<div>
						<h4>Sort</h4>
						<button onClick={handleSortByLowestPrice}>
							Sort by Lowest Price
						</button>
						<button onClick={handleSortByHighestPrice}>
							Sort by Highest Price
						</button>
						<button onClick={handleSortByNewest}>Sort by Newest</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default Filters
