'use client'

// styles
import styles from './Filters.module.scss'

// components
import Image from 'next/image'
import Accordion from './Accordion'
import { IoClose } from 'react-icons/io5'

// hooks
import { useState, useEffect } from 'react'

const Filters = ({ items, filteredItems, setFilteredItems, toggleFilters }) => {
	const sort = ['Lowest Price', 'Highest Price', 'Newest']
	const [productTypes, setProductTypes] = useState([])
	const [metalTypes, setMetalTypes] = useState([])
	const [showResetButton, setShowResetButton] = useState(false)

	useEffect(() => {
		const pTypes = new Set(['All'])
		const mTypes = new Set()

		filteredItems.forEach(item => {
			pTypes.add(item.productType)
		})

		filteredItems.forEach(item => {
			item.options?.forEach(option => {
				if (option.name === 'Metal') {
					option.values.forEach(value => {
						if (value.value.toLowerCase().includes('rose')) {
							mTypes.add('Rose')
						} else if (value.value.toLowerCase().includes('yellow')) {
							mTypes.add('Yellow')
						} else if (value.value.toLowerCase().includes('white')) {
							mTypes.add('White')
						}
					})
				}
			})
		})

		setProductTypes([...pTypes])
		setMetalTypes([...mTypes])
	}, [])

	useEffect(() => {
		if (filteredItems.length < items.length) {
			setShowResetButton(true)
		} else {
			setShowResetButton(false)
		}
	}, [filteredItems])

	// Filtering
	const handleFilter = (filter, value) => {
		if (filter === 'productType') {
			if (value === 'All') {
				setFilteredItems([...items])
			} else {
				setFilteredItems([...items].filter(item => item.productType === value))
			}
		} else if (filter === 'metalType') {
			setFilteredItems(
				[...filteredItems].filter(item =>
					item.options.some(option =>
						option.values.some(val =>
							val.value.toLowerCase().includes(value.toLowerCase())
						)
					)
				)
			)
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
			{/* Sort */}
			<Accordion title='Sort' state={true}>
				<div className={styles.buttons}>
					{sort.map(sort => (
						<button onClick={() => handleSort(sort)}>
							<p>Sort by {sort}</p>
						</button>
					))}
				</div>
			</Accordion>

			{/* Product Type */}
			<Accordion title='Type' state={true}>
				<div className={styles.buttons}>
					{productTypes.map(type => (
						<button onClick={() => handleFilter('productType', type)}>
							<p>{type}</p>
						</button>
					))}
				</div>
			</Accordion>

			{/* Metal */}
			<Accordion title='Metal' state={true}>
				<div className={styles.buttons}>
					{metalTypes.map(type => (
						<button onClick={() => handleFilter('metalType', type)}>
							<Image
								src={`/${type.toLowerCase()}.png`}
								width={16}
								height={16}
								alt={`${type} material icon.`}
								sizes='(max-width: 768px) 100vw, 50vw'
							/>
							<p>{type} Gold</p>
						</button>
					))}
				</div>
			</Accordion>

			{/* Reset Button */}
			{showResetButton && (
				<button
					className={styles.resetButton}
					onClick={() => setFilteredItems([...items])}
				>
					<p>Reset Filters</p>
				</button>
			)}

			{/* Close Button */}
			<button className={styles.closeButton} onClick={toggleFilters}>
				<p>Close</p>
				<IoClose />
			</button>
		</div>
	)
}

export default Filters
