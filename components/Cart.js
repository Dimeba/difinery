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

	// Debug: verify what shape of cart we have
	useEffect(() => {
		console.log('Cart state:', cart)
	}, [cart])

	if (!showCart || !cart) return null

	// Safely grab subtotal (fallback to "0.00")
	const subtotalRaw = cart?.cost?.totalAmount?.amount
	const subtotal = subtotalRaw ? parseFloat(subtotalRaw).toFixed(2) : '0.00'

	// Handlers expect a CartLine ID, not Variant ID
	const handleDecrease = (lineId, qty) => {
		if (qty > 1) {
			updateQuantity(lineId, qty - 1)
		} else {
			removeFromCart(lineId)
		}
	}
	const handleIncrease = (lineId, qty) => {
		updateQuantity(lineId, qty + 1)
	}

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
					{cart.lines?.edges?.length === 0 && (
						<p className={styles.emptyMessage}>Your cart is empty.</p>
					)}

					{cart.lines?.edges?.map(({ node }) => {
						// Guard against undefined node or merchandise
						if (!node) return null
						const { id: lineId, quantity } = node
						const variant = node.merchandise
						if (!variant) return null

						const title = variant.title || '—'
						const imageUrl = variant.image?.url
						const imageAlt = variant.image?.altText || title

						// Safely parse unit price
						const unitRaw = variant.priceV2?.amount
						const unitPrice = unitRaw ? parseFloat(unitRaw).toFixed(2) : '0.00'

						return (
							<div className={styles.item} key={lineId}>
								{imageUrl && (
									<Image
										src={imageUrl}
										alt={imageAlt}
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
							disabled={cart.lines?.edges?.length === 0}
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
