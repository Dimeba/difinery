'use client'

// styles
import styles from './Cart.module.scss'

// components
import { FiX } from 'react-icons/fi'
import Button from './Button'

// context
import { useCart } from '@/context/CartContext'

const Cart = () => {
	const { showCart, setShowCart, cart } = useCart()

	if (showCart && cart.lineItems.length > 0) {
		console.log(cart.lineItems)
	}

	return (
		<>
			{showCart && (
				<div className={styles.cart}>
					{/* Checkout */}
					<div className={styles.cartContent}>
						<div className={styles.cartHeading}>
							<h3>Cart</h3>
							{/* <button onClick={() => setShowCart(false)}>Close Cart</button> */}
							<FiX
								size={'1.5rem'}
								stroke={'black'}
								strokeWidth={1}
								onClick={() => setShowCart(false)}
								cursor={'pointer'}
							/>
						</div>

						{/* Checkout Button */}
						<Button
							link={cart.webUrl}
							text='Checkout'
							disabled={cart.lineItems.length > 0 ? false : true}
							newWindow
							fullWidth
						/>
					</div>
				</div>
			)}
		</>
	)
}

export default Cart
