'use client'

// styles
import styles from './Cart.module.scss'

// components
import { FiX, FiMinus, FiPlus } from 'react-icons/fi'
import Button from './Button'
import Image from 'next/image'

// context
import { useCart } from '@/context/CartContext'

const Cart = () => {
	const { showCart, setShowCart, cart } = useCart()

	// if (showCart && cart.lineItems.length > 0) {
	// 	console.log(cart.lineItems.length)
	// }

	return (
		<>
			{showCart && (
				<div className={styles.cart}>
					{/* Checkout */}
					<div className={styles.cartContent}>
						<div>
							<div className={styles.cartHeading}>
								<h3>Cart</h3>
								<FiX
									size={'1.5rem'}
									stroke={'black'}
									strokeWidth={1}
									onClick={() => setShowCart(false)}
									cursor={'pointer'}
								/>
							</div>

							{/* Items */}
							<div className={styles.itemsContainer}>
								{cart.lineItems.length > 0 &&
									cart.lineItems.map(item => (
										<div className={styles.item} key={item.variant.id}>
											<Image
												src={item.variant.image.src}
												alt='Product Image'
												width={80}
												height={80}
												style={{ objectFit: 'cover' }}
											/>
											<div className={styles.itemContent}>
												<p className={styles.itemTitle}>
													<span>{item.title}</span> / {item.variant.title}
												</p>

												<div className={styles.itemPriceContainer}>
													<p>
														Price: $
														{item.variant.price.amount.toString().slice(0, -2)}
													</p>

													<div className={styles.itemQuantity}>
														<FiMinus
															size={'1rem'}
															stroke={'black'}
															strokeWidth={1}
															onClick={() => setShowCart(false)}
															cursor={'pointer'}
														/>
														<p>{item.quantity}</p>
														<FiPlus
															size={'1rem'}
															stroke={'black'}
															strokeWidth={1}
															onClick={() => setShowCart(false)}
															cursor={'pointer'}
														/>
													</div>
												</div>
											</div>
										</div>
									))}
							</div>
						</div>

						{/* Checkout */}
						<div>
							<p className={styles.totalAmount}>
								Subtotal: ${cart.totalPrice.amount.slice(0, -2)}
							</p>
							<Button
								link={cart.webUrl}
								text='Checkout'
								disabled={cart.lineItems.length > 0 ? false : true}
								newWindow
								fullWidth
							/>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default Cart
