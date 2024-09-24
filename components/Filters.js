'use client'

// styles
import styles from './Filters.module.scss'

// components
import Image from 'next/image'
import Accordion from './Accordion'
import { IoClose } from 'react-icons/io5'

// hooks
import { useState, useEffect } from 'react'

const Filters = ({
	items,
	selectedSort,
	setSelectedSort,
	selectedProductType,
	setSelectedProductType,
	selectedMetalTypes,
	setSelectedMetalTypes,
	toggleFilters
}) => {
	const sortOptions = ['Lowest Price', 'Highest Price', 'Newest']
	const [productTypes, setProductTypes] = useState([])
	const [metalTypes, setMetalTypes] = useState([])

	useEffect(() => {
		const pTypes = new Set(['All'])
		const mTypes = new Set()

		items.forEach(item => {
			pTypes.add(item.productType)
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
	}, [items])

	const handleFilter = (filter, value) => {
		if (filter === 'productType') {
			setSelectedProductType(value)
		} else if (filter === 'metalType') {
			if (selectedMetalTypes.includes(value)) {
				setSelectedMetalTypes(selectedMetalTypes.filter(mt => mt !== value))
			} else {
				setSelectedMetalTypes([...selectedMetalTypes, value])
			}
		}
	}

	const handleSort = sortOption => {
		setSelectedSort(sortOption)
	}

	return (
		<div className={styles.filters}>
			{/* Sort */}
			<Accordion title='Sort' state={true}>
				<div className={styles.buttons}>
					{sortOptions.map(sortOption => (
						<button
							key={sortOption}
							onClick={() => handleSort(sortOption)}
							className={`${selectedSort === sortOption ? styles.active : ''} ${
								styles.optionButton
							}`}
						>
							<p>Sort by {sortOption}</p>
						</button>
					))}
					{selectedSort && (
						<button
							className={styles.resetButton}
							onClick={() => setSelectedSort(null)}
						>
							Reset Sort
						</button>
					)}
				</div>
			</Accordion>

			{/* Product Type */}
			<Accordion title='Type' state={true}>
				<div className={styles.buttons}>
					{productTypes.map(type => (
						<button
							key={type}
							onClick={() => handleFilter('productType', type)}
							className={`${
								selectedProductType === type ? styles.active : ''
							} ${styles.optionButton}`}
						>
							<p>{type}</p>
						</button>
					))}
					{selectedProductType !== 'All' && (
						<button
							className={styles.resetButton}
							onClick={() => setSelectedProductType('All')}
						>
							Reset Type
						</button>
					)}
				</div>
			</Accordion>

			{/* Metal */}
			<Accordion title='Metal' state={true}>
				<div className={styles.buttons}>
					{metalTypes.map(type => (
						<button
							key={type}
							onClick={() => handleFilter('metalType', type)}
							className={`${
								selectedMetalTypes.includes(type) ? styles.active : ''
							} ${styles.optionButton}`}
						>
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
					{selectedMetalTypes.length > 0 && (
						<button
							className={styles.resetButton}
							onClick={() => setSelectedMetalTypes([])}
						>
							Reset Metal
						</button>
					)}
				</div>
			</Accordion>

			{/* Close Button */}
			<button className={styles.closeButton} onClick={toggleFilters}>
				<p>Close</p>
				<IoClose />
			</button>
		</div>
	)
}

export default Filters
