'use client'

// styles
import styles from './ProductInfo.module.scss'

// components
import Image from 'next/image'
import Accordion from './Accordion'

// hooks
import { useState } from 'react'

// helpers
import { returnMetalType } from '@/lib/helpers'

// context
import { useCart } from '@/context/CartContext'

const ProductOptionsUI = ({ product, setSelectedColor }) => {
	const { cart, addToCart, showCart, setShowCart } = useCart()

	const [openOption, setOpenOption] = useState(0)
	const [selectedOptions, setSelectedOptions] = useState({})
	const [filteredOptions, setFilteredOptions] = useState(product.options)
	const [matchingVariant, setMatchingVariant] = useState(
		product.variants.edges[0].node
	)
	const [engraving, setEngraving] = useState('')
	const [birthstone, setBirthstone] = useState('')
	const [ringSize, setRingSize] = useState('')

	// Find the Shopify variant node matching the selected options
	const getMatchingVariant = options => {
		const selectedEntries = Object.entries(options)
		const matchingEdge = product.variants.edges.find(({ node }) =>
			selectedEntries.every(([name, value]) =>
				node.selectedOptions.some(so => so.name === name && so.value === value)
			)
		)
		if (matchingEdge) {
			setMatchingVariant(matchingEdge.node)
		} else {
			console.error('No matching variant found')
		}
	}

	// User selects an option value
	const handleOptionSelection = (optionName, value, index) => {
		// 1) update selectedOptions map
		const newSelected = { ...selectedOptions, [optionName]: value }
		setSelectedOptions(newSelected)

		// 2) re-filter optionValues for each option
		const newFiltered = product.options.map(option => ({
			...option,
			optionValues: option.optionValues.filter(optVal =>
				product.variants.edges.some(({ node: variant }) => {
					// must match all already selected options
					const matchesSelected = Object.entries(newSelected).every(
						([selName, selValue]) =>
							variant.selectedOptions.some(
								so => so.name === selName && so.value === selValue
							)
					)
					if (!matchesSelected) return false
					// and must support this option’s value
					return variant.selectedOptions.some(
						so => so.name === option.name && so.value === optVal.name
					)
				})
			)
		}))
		setFilteredOptions(newFiltered)

		// 3) update matchingVariant
		getMatchingVariant(newSelected)

		// 4) advance to next dropdown
		setOpenOption(index + 1)

		// 5) set selected color if applicable
		if (optionName === 'Metal') {
			setSelectedColor(value)
		}
	}

	// Reset a single option
	const handleOptionReset = optionName => {
		const newSelected = { ...selectedOptions }
		delete newSelected[optionName]
		setSelectedOptions(newSelected)

		const newFiltered = product.options.map(option => ({
			...option,
			optionValues: option.optionValues.filter(optVal =>
				product.variants.edges.some(({ node: variant }) => {
					const matchesSelected = Object.entries(newSelected).every(
						([selName, selValue]) =>
							variant.selectedOptions.some(
								so => so.name === selName && so.value === selValue
							)
					)
					if (!matchesSelected) return false
					return variant.selectedOptions.some(
						so => so.name === option.name && so.value === optVal.name
					)
				})
			)
		}))
		setFilteredOptions(newFiltered)
		getMatchingVariant(newSelected)
	}

	// Reset all options
	const handleReset = () => {
		setSelectedOptions({})
		setFilteredOptions(product.options)
		setOpenOption(0)
		setMatchingVariant(product.variants.edges[0].node)
		setSelectedColor(null)
	}

	// Add the variant (with custom attributes) to the cart
	const handleAddToCart = async () => {
		const customFields = []
		if (engraving) customFields.push({ key: 'Engraving', value: engraving })
		if (birthstone) customFields.push({ key: 'Birthstone', value: birthstone })
		if (ringSize) customFields.push({ key: 'Ring Size', value: ringSize })

		if (!matchingVariant || !matchingVariant.id) {
			console.error('No matching variant found')
			return
		}

		try {
			await addToCart(
				matchingVariant.id,
				1,
				customFields.length ? customFields : []
			)

			// advance your UI steps
			setOpenOption(prev => prev + 1)
			if (!showCart) setShowCart(true)
		} catch (err) {
			console.error('Add to cart mutation failed', err)
		}
	}

	const allOptionsSelected =
		Object.keys(selectedOptions).length === product.options.length

	const birthstones = [
		{ month: 'January', stones: ['Garnet'] },
		{ month: 'February', stones: ['Amethyst'] },
		{ month: 'March', stones: ['Aquamarine', 'Bloodstone'] },
		{ month: 'April', stones: ['Diamond'] },
		{ month: 'May', stones: ['Emerald'] },
		{ month: 'June', stones: ['Pearl', 'Moonstone', 'Alexandrite'] },
		{ month: 'July', stones: ['Ruby'] },
		{ month: 'August', stones: ['Peridot', 'Sardonyx', 'Spinel'] },
		{ month: 'September', stones: ['Sapphire'] },
		{ month: 'October', stones: ['Opal', 'Tourmaline'] },
		{ month: 'November', stones: ['Topaz', 'Citrine'] },
		{ month: 'December', stones: ['Turquoise', 'Zircon', 'Tanzanite'] }
	]

	const ringSizes = [
		'4',
		'4.5',
		'5',
		'5.5',
		'6',
		'6.5',
		'7',
		'7.5',
		'8',
		'8.5',
		'9',
		'9.5',
		'10',
		'10.5',
		'11',
		'11.5',
		'12'
	]

	return (
		<div className={styles.content}>
			<div className={styles.versionInfo}>
				<h3>{product.title}</h3>
				{Object.keys(selectedOptions).length > 0 && (
					<p>
						{Object.values(selectedOptions).join(' / ')}{' '}
						<span className={styles.resetButton} onClick={handleReset}>
							Reset All
						</span>
					</p>
				)}
			</div>

			<p>{product.description}</p>

			<div className={styles.accordion}>
				{filteredOptions.map((option, index) => (
					<Accordion
						key={option.name}
						small
						title={option.name}
						state={index === openOption}
						setOpenOption={() => setOpenOption(index)}
						product
						display
					>
						<div className={styles.variantButtonsContainer}>
							{option.optionValues.map(value => (
								<button
									key={value.name}
									className={styles.variantButton}
									onClick={() =>
										handleOptionSelection(option.name, value.name, index)
									}
								>
									{option.name === 'Metal' && (
										<Image
											src={`/${returnMetalType(value.name.toLowerCase())}`}
											width={16}
											height={16}
											alt={`${value.name} ${option.name}`}
										/>
									)}
									{value.name}
								</button>
							))}
							{selectedOptions[option.name] && (
								<button
									className={styles.resetButton}
									onClick={() => handleOptionReset(option.name)}
								>
									Reset
								</button>
							)}
						</div>
					</Accordion>
				))}

				{product.category.name === 'Rings' && (
					<>
						{/* Ring Size */}
						<Accordion
							small
							title='Ring Size'
							state={openOption === filteredOptions.length}
							setOpenOption={() => setOpenOption(filteredOptions.length)}
							product
							display
						>
							<div className={styles.variantButtonsContainer}>
								{ringSizes.map(value => (
									<button
										key={value}
										className={styles.variantButton}
										onClick={() => setRingSize(value)}
									>
										{value}
									</button>
								))}
								{ringSize && (
									<button
										className={styles.resetButton}
										onClick={() => setRingSize('')}
									>
										Reset
									</button>
								)}
							</div>
						</Accordion>

						{/* Engraving */}
						<Accordion
							small
							title='Engraving (max. 20 characters)'
							state={openOption === filteredOptions.length}
							product
							display
							setOpenOption={() => setOpenOption(filteredOptions.length)}
						>
							<input
								type='text'
								placeholder='Add your text here'
								value={engraving}
								onChange={e => setEngraving(e.target.value)}
								className={styles.engravingInput}
								maxLength={20}
							/>
						</Accordion>
					</>
				)}

				{/* {(product.category.name === 'Rings' ||
					product.category.name === 'Pendants') && (
					<Accordion
						small
						title='Birthstone'
						state={openOption === filteredOptions.length}
						product
						display
						setOpenOption={() => setOpenOption(filteredOptions.length)}
					>
						<select
							className={styles.select}
							value={birthstone}
							onChange={e => setBirthstone(e.target.value)}
						>
							<option value=''>Select birthstone</option>
							{birthstones.map(({ month, stones }) => (
								<optgroup label={month} key={month}>
									{stones.map(stone => (
										<option value={stone} key={stone}>
											{stone}
										</option>
									))}
								</optgroup>
							))}
						</select>
					</Accordion>
				)} */}
			</div>

			<div className={styles.cartBox}>
				<p className={styles.orderDate}>
					Made to Order: Between {new Date().toLocaleDateString()}–{' '}
					{new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}{' '}
					with you.
				</p>

				<button
					className={styles.cartButton}
					onClick={handleAddToCart}
					disabled={!allOptionsSelected}
				>
					ADD TO CART
				</button>

				<p className={styles.tax}>
					Tax included
					<br />
					Shipping calculated at checkout.
					<br />
					<b>
						$15 of your purchase goes to The New York Women&apos;s Foundation
					</b>
				</p>
			</div>
		</div>
	)
}

export default ProductOptionsUI
