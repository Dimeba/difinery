// styles
import styles from './SaleHero.module.scss'

// components
import Image from 'next/image'
import ProductCard from './ProductCard'

const SaleHero = ({ products }) => {
	return (
		<section>
			<div className={`container ${styles.saleHero}`}>
				<div className={styles.collection}>
					<div className={styles.image}>
						<Image
							src='/sample-image1.jpg'
							fill
							alt='Collection Preview'
							style={{ objectFit: 'cover' }}
						/>
					</div>

					<h5>Mother's Day Collection</h5>
					<p>UP TO 50% OFF</p>
				</div>

				{products &&
					products.map(product => (
						<ProductCard
							key={product.id}
							id={product.id}
							permalink={product.handle}
							showPrice
							discount
							hideMaterials
						/>
					))}
			</div>
		</section>
	)
}

export default SaleHero
