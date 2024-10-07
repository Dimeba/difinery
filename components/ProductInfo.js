// styles
import styles from './ProductInfo.module.scss'

// components
import Image from 'next/image'
import ProductOptionsUI from './ProductOptionsUI'

const ProductInfo = ({ product }) => {
	return (
		<section className='topSection'>
			<div className={styles.productInfo}>
				<div className={styles.image}>
					<Image src={product.images[0].src} fill alt='Image of the product.' />
				</div>

				<ProductOptionsUI product={product} />
			</div>
		</section>
	)
}

export default ProductInfo
