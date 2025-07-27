'use client'

// styles
import styles from './Cart.module.scss'
import productStyles from './ProductInfo.module.scss'

// components
import CartItem from './CartItem'
import { FiX, FiMinus, FiPlus } from 'react-icons/fi'
import { MdDeleteForever } from 'react-icons/md'

import Button from './Button'
import Image from 'next/image'
import Link from 'next/link'

// hooks
import { useCart } from '@/context/CartContext'

const Cart = () => {
	const { showCart, setShowCart, cart, updateQuantity, removeFromCart } =
		useCart()

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

	const removeAllrelatedItems = lineId => {
		removeFromCart(lineId)
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

					{cart.lines?.edges?.map(({ node }) => (
						<CartItem
							node={node}
							key={node.id}
							removeAllrelatedItems={removeAllrelatedItems}
							removeFromCart={removeFromCart}
						/>
					))}
				</div>

				{/* Subtotal & Checkout */}
				<div className={styles.checkoutSection}>
					<div>
						<div className={styles.subtotal}>
							{/* Price */}
							<p className={styles.totalAmount} style={{ color: '#6d6b6b' }}>
								Subtotal
							</p>

							<p className={styles.totalAmount} style={{ fontWeight: '700' }}>
								${Number(subtotal.slice(0, -3)).toLocaleString()}
							</p>
						</div>

						{/* Taxes */}
						<div className={styles.subtotal}>
							<p className={styles.totalAmount} style={{ color: '#6d6b6b' }}>
								Taxes
							</p>

							<p className={styles.totalAmount} style={{ fontWeight: '700' }}>
								-
							</p>
						</div>

						{/* Shipping */}
						<div className={styles.subtotal}>
							<p className={styles.totalAmount} style={{ color: '#6d6b6b' }}>
								Shipping*
							</p>

							<p className={styles.totalAmount} style={{ fontWeight: '700' }}>
								Calculated at checkout
							</p>
						</div>
					</div>

					<div className={styles.note}>
						<p>*Your order will be fulfilled within 7 business days.</p>

						<p>
							*Please note that any special request affecting weight or
							dimensions may impact the final price and extend the standard
							production timeline by 2-3 business days (in addition to the 7-day
							shipping window). If this applies, we'll follow up via email with
							an updated quote before proceeding with payment.
						</p>
					</div>

					<Link
						href={cart.checkoutUrl}
						style={{
							pointerEvents: cart.lines?.edges?.length > 0 ? 'auto' : 'none'
						}}
					>
						<button
							className={productStyles.cartButton}
							disabled={cart.lines?.edges?.length === 0}
						>
							Checkout
						</button>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Cart
