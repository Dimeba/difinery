'use client'

// styles
import styles from './ProductInfo.module.scss'

// components
import Image from 'next/image'
import Accordion from './Accordion'

// lib
import { client } from '@/lib/commerce'

const ProductInfo = ({ product }) => {
	const addToCart = () => {
		client.cart.add(product.id, 1)
		client.cart.contents().then(items => console.log(items))
	}

	return (
		<section>
			<div className={`container ${styles.productInfo}`}>
				<div className={styles.image}>
					<Image src={product.assets[0].url} fill alt='Image of the product.' />
				</div>

				<div className={styles.content}>
					<h3>{product.name}</h3>
					<p>${product.price.formatted}</p>

					<div dangerouslySetInnerHTML={{ __html: product.description }} />

					{/* Options */}
					<div className={styles.accordion}>
						<Accordion title='Metal Type' state={true}>
							<div>
								<Image
									src='/gold.png'
									alt='Material type icon'
									width={32}
									height={32}
								/>
								<Image
									src='/silver.png'
									alt='Material type icon'
									width={32}
									height={32}
								/>
								<Image
									src='/bronze.png'
									alt='Material type icon'
									width={32}
									height={32}
								/>
							</div>
						</Accordion>

						<Accordion small title='Ring Size' />
						<Accordion small title='Diamon Shape' />
						<Accordion small title='Clarity' />
						<Accordion small title='Engraving' />
					</div>

					<div className={styles.cartBox}>
						<p className={styles.orderDate}>
							Made to Order: Between 06.04-13.04 with you.
						</p>

						<button className={styles.cartButton} onClick={addToCart}>
							ADD TO CART
						</button>

						<p className={styles.tax}>
							Tax included
							<br />
							Shipping calculated at checkout.
							<br />
							<b>
								$15 of your purchase goes to The New York Women's Foundation
							</b>
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}

export default ProductInfo
