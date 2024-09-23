'use client'

// styles
import styles from './Filters.module.scss'

// components
import Accordion from './Accordion'
import { IoClose } from 'react-icons/io5'

// hooks
import { useState, useEffect } from 'react'

const Filters = ({ items, setFilteredItems, toggleFilters }) => {
	const sortList = ['Lowest Price', 'Highest Price', 'Newest']
	const [productTypes, setProductTypes] = useState([])

	useEffect(() => {
		const types = ['All']

		items.forEach(item => {
			if (!types.includes(item.productType)) {
				types.push(item.productType)
			}
		})

		setProductTypes(types)
	}, [])

	// Filtering
	const handleFilter = (filter, value) => {
		if (filter === 'productType') {
			if (value === 'All') {
				setFilteredItems([...items])
			} else {
				setFilteredItems([...items].filter(item => item.productType === value))
			}
		}
	}

	// Sorting
	const handleSort = sort => {
		switch (sort) {
			case 'Lowest Price':
				setFilteredItems(
					[...items].sort(
						(a, b) =>
							Math.min(...a.variants.map(variant => variant.price.amount)) -
							Math.min(...b.variants.map(variant => variant.price.amount))
					)
				)
				break
			case 'Highest Price':
				setFilteredItems(
					[...items].sort(
						(a, b) =>
							Math.max(...b.variants.map(variant => variant.price.amount)) -
							Math.max(...a.variants.map(variant => variant.price.amount))
					)
				)
				break
			case 'Newest':
				setFilteredItems(
					[...items].sort(
						(a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
					)
				)
				break
		}
	}

	return (
		<div className={styles.filters}>
			<div className={styles.buttons}>
				<h4>Sort</h4>

				{sortList.map(sort => (
					<button onClick={() => handleSort(sort)}>
						<p>Sort by {sort}</p>
					</button>
				))}
			</div>

			<div className={styles.buttons}>
				<h4>Filters</h4>

				{productTypes.map(type => (
					<button onClick={() => handleFilter('productType', type)}>
						<p>{type}</p>
					</button>
				))}
			</div>

			<button className={styles.closeButton} onClick={toggleFilters}>
				<p>Close</p>
				<IoClose />
			</button>
		</div>
	)
}

export default Filters
