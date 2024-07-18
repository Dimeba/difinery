// styles
import styles from './ProductInfo.module.scss'

// components
import Image from 'next/image'
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
				</div>
			</div>
		</section>
	)
}

export default ProductInfo
