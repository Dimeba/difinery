'use client'

// styles
import styles from './Cart.module.scss'

// context
import { useCart } from '@/context/CartContext'

const Cart = () => {
	const { showCart, setShowCart } = useCart()

	return (
		<>
			{showCart && (
				<div className={styles.cart}>
					<p>cart</p>
					<button onClick={() => setShowCart(false)}>Close Cart</button>
				</div>
			)}
		</>
	)
}

export default Cart
