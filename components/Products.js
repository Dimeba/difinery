'use client'

import styles from './Products.module.scss'

// components
import Image from 'next/image'
import Link from 'next/link'
import ProductCard from './ProductCard'

const Products = ({
	content,
	items,
	type,
	threeColumn,
	gap,
	showPrice,
	discount
}) => {
	return (
		<div className={styles.products} style={{ gap: gap ? '0.3rem' : '0' }}>
			{/* Categories */}
			{type == 'collections' &&
				content.map(item => (
					<div
						key={item.id}
						className={`${styles.product} ${styles.fourColumn}`}
					>
						<Link
							href={'/' + item.title.replace(/ /g, '-').toLowerCase()}
							aria-label={`Link to ${item.name} page.`}
						>
							<div className={styles.image}>
								<Image
									src={item.image.src}
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
			{type == 'products' &&
				items
					.filter(item => item.availableForSale)
					.map(product => (
						<ProductCard
							key={product.id}
							id={product.id}
							permalink={product.handle}
							threeColumn={threeColumn}
							showPrice={showPrice}
							discount={discount}
							secondImagePriority={fullWidth} // Show second image if it's full width
						/>
					))}

			{/* Variants */}
			{type == 'variants' &&
				items
					.filter(item => item.availableForSale)
					.map(product =>
						product.variants
							.filter(item => item.available)
							.map(variant => (
								<ProductCard
									key={variant.id}
									id={product.id}
									permalink={product.handle}
									threeColumn={threeColumn}
									showPrice={showPrice}
									discount={discount}
									isVariant={true}
									variantId={variant.id}
								/>
							))
					)}

			{/* Recomendations */}
			{type == 'recommended' &&
				products
					.filter(item => item.availableForSale)
					.map(product => (
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
	)
}

export default Products
