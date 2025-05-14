'use client'

import styles from './Cart.module.scss'
import { FiX, FiMinus, FiPlus } from 'react-icons/fi'
import Button from './Button'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { useEffect } from 'react'

const Cart = () => {
	const { showCart, setShowCart, cart, updateQuantity, removeFromCart } =
		useCart()

	// debug: watch for updates
	useEffect(() => {
		console.log('✅ cart updated:', cart)
	}, [cart])

	if (!showCart || !cart) return null

	// Decrease a line’s qty or remove when it gets to zero
	const handleDecrease = (lineId, qty) => {
		if (qty > 1) {
			updateQuantity(lineId, qty - 1)
		} else {
			removeFromCart(lineId)
		}
	}

	// Increase a line’s qty by 1
	const handleIncrease = (lineId, qty) => {
		updateQuantity(lineId, qty + 1)
	}

	// Format subtotal
	const subtotal = parseFloat(cart.cost.totalAmount.amount).toFixed(2)

	return (
		<div className={styles.cart}>
			<div className={styles.cartContent}>
				{/* Header */}
				<div className={styles.cartHeading}>
					<h3>Cart</h3>
					<FiX
						size='1.5rem'
						onClick={() => setShowCart(false)}
						cursor='pointer'
					/>
				</div>

				{/* Items */}
				<div className={styles.itemsContainer}>
					{cart.lines.edges.length === 0 && (
						<p className={styles.emptyMessage}>Your cart is empty.</p>
					)}
					{cart.lines.edges.map(({ node }) => {
						const { id: lineId, quantity, merchandise } = node
						const { title, priceV2, image } = merchandise
						const unitPrice = parseFloat(priceV2.amount).toFixed(2)

						return (
							<div className={styles.item} key={lineId}>
								{image?.url && (
									<Image
										src={image.url}
										alt={image.altText || title}
										width={80}
										height={80}
										style={{ objectFit: 'cover' }}
									/>
								)}
								<div className={styles.itemContent}>
									<p className={styles.itemTitle}>{title}</p>
									<div className={styles.itemPriceContainer}>
										<p>Price: ${unitPrice}</p>
										<div className={styles.itemQuantity}>
											<FiMinus
												size='1rem'
												onClick={() => handleDecrease(lineId, quantity)}
												cursor='pointer'
											/>
											<span className={styles.quantity}>{quantity}</span>
											<FiPlus
												size='1rem'
												onClick={() => handleIncrease(lineId, quantity)}
												cursor='pointer'
											/>
										</div>
									</div>
								</div>
							</div>
						)
					})}
				</div>

				{/* Subtotal & Checkout */}
				<div className={styles.checkoutSection}>
					<p className={styles.totalAmount}>Subtotal: ${subtotal}</p>
					{cart.checkoutUrl ? (
						<Button
							link={cart.checkoutUrl}
							text='Checkout'
							disabled={cart.lines.edges.length === 0}
							fullWidth
						/>
					) : (
						<Button text='Checkout' disabled fullWidth />
					)}
				</div>
			</div>
		</div>
	)
}

export default Cart
