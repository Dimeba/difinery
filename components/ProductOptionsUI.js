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

	const [selectedOptions, setSelectedOptions] = useState(product.options)

	const handleAddToCart = id => {
		addToCart(id, 1)

		if (!showCart) {
			setShowCart(true)
		}
	}

	const handleOptionSelection = value => {
		setSelectedOptions(prevState =>
			prevState.filter(option => option.values.includes(value))
		)

		console.log(selectedOptions)
	}

	console.log(product.options)

	return (
		<>
			<div className={styles.accordion}>
				{product.options.map((option, index) => (
					<Accordion
						key={option.id}
						small
						title={option.name}
						state={openOption == index ? true : false}
					>
						<div className={styles.variantButtonsContainer}>
							{option.values.map(value => (
								<button
									className={styles.variantButton}
									key={value.value}
									onClick={() => handleOptionSelection(value)}
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
