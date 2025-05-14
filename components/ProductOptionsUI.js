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

const ProductOptionsUI = ({ product }) => {
	const [openOption, setOpenOption] = useState(0)
	const { addToCart, setShowCart, showCart } = useCart()

	const [selectedOptions, setSelectedOptions] = useState({})
	const [filteredOptions, setFilteredOptions] = useState(product.options)

	const [matchingVariant, setMatchingVariant] = useState(
		product.variants.edges[0].node
	)

	const [engraving, setEngraving] = useState('')
	const [birthstone, setBirthstone] = useState('')

	// Get the matching variant based on selected options
	const getMatchingVariant = options => {
		const selectedEntries = Object.entries(options)

		// Look through each edge’s node.selectedOptions
		const matchingEdge = product.variants.edges.find(({ node }) =>
			selectedEntries.every(([name, value]) =>
				node.selectedOptions.some(so => so.name === name && so.value === value)
			)
		)

		if (matchingEdge) {
			// we keep the full edge so you can still do matchingEdge.node.price, etc.
			setMatchingVariant(matchingEdge)
		} else {
			console.error('No matching variant found')
		}
	}

	// Add matching variant to cart
	const handleAddToCart = () => {
		const customFields = []

		if (engraving !== '') {
			customFields.push({ key: 'Engraving', value: engraving })
		}

		if (birthstone !== '') {
			customFields.push({ key: 'Birthstone', value: birthstone })
		}

		if (matchingVariant) {
			addToCart(
				matchingVariant.id,
				1,
				// engraving !== '' ? [{ key: 'Engraving', value: engraving }] : null,
				customFields.length > 0 ? customFields : null
			)

			// displaying next options
			setOpenOption(prevState => prevState + 1)

			if (!showCart) {
				setShowCart(true)
			}
		} else {
			console.error('No matching variant found')
		}
	}

	// Select an option
	const handleOptionSelection = (optionName, value, index) => {
		// 1) Build the new selectedOptions map
		const newSelectedOptions = {
			...selectedOptions,
			[optionName]: value
		}
		setSelectedOptions(newSelectedOptions)

		// 2) Re-filter each option’s optionValues based on the updated selections
		const newFilteredOptions = product.options.map(option => ({
			...option,
			optionValues: option.optionValues.filter(optVal => {
				return product.variants.edges.some(({ node: variant }) => {
					// a) Must match all already-selected options
					const matchesSelected = Object.entries(newSelectedOptions).every(
						([selName, selValue]) =>
							variant.selectedOptions.some(
								so => so.name === selName && so.value === selValue
							)
					)
					if (!matchesSelected) return false

					// b) And must have this option’s value
					return variant.selectedOptions.some(
						so => so.name === option.name && so.value === optVal.name
					)
				})
			})
		}))
		setFilteredOptions(newFilteredOptions)

		// 3) Find any fully-matched variant
		getMatchingVariant(newSelectedOptions)

		// 4) Advance to the next dropdown
		setOpenOption(index + 1)
	}

	// Reset individual option
	const handleOptionReset = optionName => {
		// 1) Remove that option from selectedOptions
		const newSelectedOptions = { ...selectedOptions }
		delete newSelectedOptions[optionName]
		setSelectedOptions(newSelectedOptions)

		// 2) Re-filter all options based on what remains selected
		const newFilteredOptions = product.options.map(option => ({
			...option,
			optionValues: option.optionValues.filter(optVal => {
				return product.variants.edges.some(({ node: variant }) => {
					// a) Must match all remaining selections
					const matchesSelected = Object.entries(newSelectedOptions).every(
						([selName, selValue]) =>
							variant.selectedOptions.some(
								so => so.name === selName && so.value === selValue
							)
					)
					if (!matchesSelected) return false

					// b) Must support this option’s value too
					return variant.selectedOptions.some(
						so => so.name === option.name && so.value === optVal.name
					)
				})
			})
		}))
		setFilteredOptions(newFilteredOptions)

		// 3) Recompute matching variant
		getMatchingVariant(newSelectedOptions)
	}

	// Reset all options
	const handleReset = () => {
		setSelectedOptions({})
		setFilteredOptions(product.options)
		setOpenOption(0)
		setMatchingVariant(product.variants[0])
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

	return (
		<div className={styles.content}>
			<div className={styles.versionInfo}>
				<h3>{product.title}</h3>
				{Object.keys(selectedOptions).length > 0 && (
					<p>
						{Object.values(selectedOptions).join(' / ')} /{' '}
						<span className={styles.resetButton} onClick={handleReset}>
							Reset All
						</span>
					</p>
				)}
			</div>
			{/* <p className={styles.price}>
				From ${matchingVariant.node.price.amount.toString().slice(0, -2)}
			</p> */}

			<p>{product.description}</p>

			<div className={styles.accordion}>
				{filteredOptions.map((option, index) => (
					<Accordion
						key={option.name}
						small
						title={option.name}
						state={index === openOption}
						setOpenOption={() => setOpenOption(index)}
						product={true}
						display={true}
					>
						<div className={styles.variantButtonsContainer}>
							{option.optionValues.map(value => (
								<button
									className={styles.variantButton}
									key={value.name}
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

				{/* Engraving */}
				{(product.productType === 'Ring' ||
					product.productType === 'Pendant') && (
					<Accordion
						small
						title='Engraving (max. 20 characters)'
						state={openOption === filteredOptions.length}
						product={true}
						display={true}
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
				)}

				{/* Birthstone */}
				{(product.productType === 'Ring' ||
					product.productType === 'Pendant') && (
					<Accordion
						small
						title='Birthstone'
						state={openOption === filteredOptions.length}
						product={true}
						display={true}
						setOpenOption={() => setOpenOption(filteredOptions.length)}
					>
						<select
							className={styles.select}
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
				)}
			</div>

			<div className={styles.cartBox}>
				<p className={styles.orderDate}>
					Made to Order: Between {new Date().toLocaleDateString()}-
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
					<b>$15 of your purchase goes to The New York Women's Foundation</b>
				</p>
			</div>
		</div>
	)
}

export default ProductOptionsUI
