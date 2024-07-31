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

	const [selectedOptions, setSelectedOptions] = useState([])
	const [filteredOptions, setFilteredOptions] = useState(product.options)

	const handleAddToCart = id => {
		addToCart(id, 1)

		if (!showCart) {
			setShowCart(true)
		}
	}

	const handleOptionSelection = value => {
		let newSelectedOptions

		if (!selectedOptions.includes(value)) {
			// add the value to the selected options
			newSelectedOptions = [...selectedOptions, value]
		} else {
			// remove the value from the selected options
			newSelectedOptions = selectedOptions.filter(option => option !== value)
		}
		setSelectedOptions(newSelectedOptions)

		// Filter options based on selected options
		const newFilteredOptions = product.options.map(option => ({
			...option,
			values: option.values.filter(val => {
				return product.variants.some(
					variant =>
						newSelectedOptions.every(selectedOption =>
							variant.selectedOptions.some(
								selectedOptionObj => selectedOptionObj.value === selectedOption
							)
						) &&
						variant.selectedOptions.some(
							selectedOptionObj => selectedOptionObj.value === val.value
						)
				)
			})
		}))
		setFilteredOptions(newFilteredOptions)

		// displying next options
		if (openOption < product.options.length - 1) {
			setOpenOption(prevState => prevState + 1)
		}
	}

	console.log(product.variants.length)

	return (
		<>
			<div className={styles.accordion}>
				{filteredOptions.map((option, index) => (
					<Accordion
						key={option.id}
						small
						title={option.name}
						// state={index === openOption}
						state={true}
					>
						<div className={styles.variantButtonsContainer}>
							{option.values.map(value => (
								<button
									className={styles.variantButton}
									key={value.value}
									onClick={() => handleOptionSelection(value.value)}
								>
									{value.value}
								</button>
							))}
						</div>
					</Accordion>
				))}
			</div>

			<div className={styles.cartBox}>
				<p className={styles.orderDate}>
					Made to Order: Between 06.04-13.04 with you.
				</p>

				<button
					className={styles.cartButton}
					onClick={() => handleAddToCart(product.variants[0].id)}
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
		</>
	)
}

export default ProductOptionsUI
