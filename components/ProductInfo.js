// styles
import styles from './ProductInfo.module.scss'

// components
import Image from 'next/image'
import Accordion from './Accordion'
import ProductOptionsUI from './ProductOptionsUI'

const ProductInfo = ({ product }) => {
	// console.log(product.options[0].values)

	return (
		<section>
			<div className={`container ${styles.productInfo}`}>
				<div className={styles.image}>
					<Image src={product.images[0].src} fill alt='Image of the product.' />
				</div>

				<div className={styles.content}>
					<h3>{product.title}</h3>
					<p className={styles.price}>
						${product.variants[0].price.amount.toString().slice(0, -2)}
					</p>

					<p>{product.description}</p>

					{/* Options */}
					<ProductOptionsUI product={product} />

					<div className={styles.cartBox}>
						<p className={styles.orderDate}>
							Made to Order: Between 06.04-13.04 with you.
						</p>

						<button className={styles.cartButton}>ADD TO CART</button>

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
