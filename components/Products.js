// styles
import styles from './Products.module.scss'

// components
import Image from 'next/image'
import Link from 'next/link'
import ProductCard from './ProductCard'

const Products = ({ title, categories, products }) => {
	return (
		<section>
			<div className={`container ${styles.content}`}>
				{title && <h3>{title}</h3>}

				<div className={styles.products}>
					{/* Categories */}
					{categories &&
						categories.map(item => (
							<div key={item.id} className={styles.product}>
								<Link href='#' aria-label={`Link to ${item.name} page.`}>
									<div className={styles.image}>
										<Image
											src={item.assets[0].url}
											fill
											alt='Category Image.'
											style={{ objectFit: 'cover' }}
										/>
									</div>
								</Link>
								<h4>{item.name}</h4>
							</div>
						))}

					{/* Products */}
					{products &&
						products.map(item => (
							<ProductCard key={item.id} permalink={item.permalink} />
						))}
				</div>
			</div>
		</section>
	)
}

export default Products
