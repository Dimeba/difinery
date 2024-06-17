// styles
import styles from './Products.module.scss'

// components
import Image from 'next/image'
import Link from 'next/link'
import ProductCard from './ProductCard'

const Products = ({
	title,
	categories,
	products,
	threeColumn,
	showPrice,
	discount
}) => {
	return (
		<section>
			<div className={`container ${styles.content}`}>
				{title && <h3>{title}</h3>}

				<div className={styles.products}>
					{/* Categories */}
					{categories &&
						categories.map(item => (
							<div
								key={item.id}
								className={`${styles.product} ${styles.fourColumn}`}
							>
								<Link href='/shop' aria-label={`Link to ${item.name} page.`}>
									<div className={styles.image}>
										<Image
											src={item.products[0].images[0].src}
											fill
											alt='Category Image.'
											style={{ objectFit: 'cover' }}
										/>
									</div>
								</Link>
								<h4>{item.title}</h4>
							</div>
						))}

					{/* Products */}
					{products &&
						products.map(product => (
							<ProductCard
								key={product.id}
								id={product.id}
								permalink={product.handle}
								threeColumn={threeColumn}
								showPrice={showPrice}
								discount={discount}
							/>
						))}
				</div>
			</div>
		</section>
	)
}

export default Products
