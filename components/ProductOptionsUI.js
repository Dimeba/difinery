'use client'

// styles
import styles from './ProductInfo.module.scss'

// components
import Image from 'next/image'
import Accordion from './Accordion'

// hooks
import { useState } from 'react'

// context
import { useCart } from '@/context/CartContext'

const ProductOptionsUI = ({ product }) => {
	const [openOption, setOpenOption] = useState(0)
	const { addToCart, setShowCart, showCart } = useCart()

	const [selectedOptions, setSelectedOptions] = useState({})
	const [filteredOptions, setFilteredOptions] = useState(product.options)

	const [matchingVariant, setMatchingVariant] = useState(product.variants[0])

	const [engraving, setEngraving] = useState('')
	const [birthstone, setBirthstone] = useState('')

	// Get the matching variant based on selected options
	const getMatchingVariant = options => {
		const selectedOptionEntries = Object.entries(options)
		const matchingVariant = product.variants.find(variant =>
			selectedOptionEntries.every(([optionName, selectedValue]) =>
				variant.selectedOptions.some(
					variantOption =>
						variantOption.name === optionName &&
						variantOption.value === selectedValue
				)
			)
		)

		if (matchingVariant) {
			setMatchingVariant(matchingVariant)
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
		const newSelectedOptions = {
			...selectedOptions,
			[optionName]: value
		}

		setSelectedOptions(newSelectedOptions)

		// Filter options based on selected options
		const newFilteredOptions = product.options.map(option => ({
			...option,
			values: option.values.filter(val => {
				return product.variants.some(
					variant =>
						Object.entries(newSelectedOptions).every(
							([selectedOptionName, selectedValue]) =>
								variant.selectedOptions.some(
									variantOption =>
										variantOption.name === selectedOptionName &&
										variantOption.value === selectedValue
								)
						) &&
						variant.selectedOptions.some(
							variantOption =>
								variantOption.name === option.name &&
								variantOption.value === val.value
						)
				)
			})
		}))
		setFilteredOptions(newFilteredOptions)
		getMatchingVariant(newSelectedOptions)

		// displaying next options
		setOpenOption(index + 1)
	}

	// Reset individual option
	const handleOptionReset = optionName => {
		const newSelectedOptions = { ...selectedOptions }
		delete newSelectedOptions[optionName]
		setSelectedOptions(newSelectedOptions)

		// Update filteredOptions
		const newFilteredOptions = product.options.map(option => ({
			...option,
			values: option.values.filter(val => {
				return product.variants.some(
					variant =>
						Object.entries(newSelectedOptions).every(
							([selectedOptionName, selectedValue]) =>
								variant.selectedOptions.some(
									variantOption =>
										variantOption.name === selectedOptionName &&
										variantOption.value === selectedValue
								)
						) &&
						variant.selectedOptions.some(
							variantOption =>
								variantOption.name === option.name &&
								variantOption.value === val.value
						)
				)
			})
		}))
		setFilteredOptions(newFilteredOptions)
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
			<p className={styles.price}>
				${matchingVariant.price.amount.toString().slice(0, -2)}
			</p>

			<p>{product.description}</p>

			<div className={styles.accordion}>
				{filteredOptions.map((option, index) => (
					<Accordion
						key={option.id}
						small
						title={option.name}
						state={index === openOption}
						product={true}
						display={true}
					>
						<div className={styles.variantButtonsContainer}>
							{option.values.map(value => (
								<button
									className={styles.variantButton}
									key={value.value}
									onClick={() =>
										handleOptionSelection(option.name, value.value, index)
									}
								>
									{value.value}
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
						title='Birthstone (max. 20 characters)'
						state={openOption === filteredOptions.length}
						product={true}
						display={true}
					>
						<input
							type='text'
							placeholder='Add your text here'
							value={birthstone}
							onChange={e => setBirthstone(e.target.value)}
							className={styles.engravingInput}
							maxLength={20}
						/>
					</Accordion>
				)}
			</div>

			<div className={styles.cartBox}>
				<p className={styles.orderDate}>
					Made to Order: Between 06.04-13.04 with you.
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
