'use client'

// styles
import styles from './Filters.module.scss'

// components

// hooks
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const Filters = ({ items, setFilteredItems }) => {
	const pathName = usePathname()

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

	console.log(items[0])

	// Returning component if path is '/shop'
	if (pathName == '/shop') {
		return (
			<div className='container'>
				<button onClick={handeShowFilters}>Filter & Sort</button>

				{showFilters && (
					<div>
						<p onClick={handleFilter}>Filters</p>
						<p onClick={handleCancel}>Cancel</p>
						<p onClick={handleSortByLowestPrice}>Sort by Lowest Price</p>
						<p onClick={handleSortByHighestPrice}>Sort by Highest Price</p>
						<p onClick={handleSortByNewest}>Sort by Newest</p>
					</div>
				)}
			</div>
		)
	} else {
		return null
	}
}

export default Filters
