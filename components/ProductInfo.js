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
					<Image
						src={product.images.edges[0].node.url}
						fill
						alt='Image of the product.'
						sizes={'(max-width: 768px) 100vw, 50vw'}
					/>
				</div>

				<ProductOptionsUI product={product} />
			</div>
		</section>
	)
}

export default ProductInfo
