// styles
import styles from './Products.module.scss'

// components
import Image from 'next/image'
import Link from 'next/link'
import ProductCard from './ProductCard'

// lib
import { getCollections } from '@/lib/shopify'

const Products = async ({
	title,
	categories,
	products,
	threeColumn,
	showPrice,
	discount
}) => {
	// Shopify
	const collections = await getCollections()
	const decodedIDs = []

	// Extract Shopify Collection ID from base64
	const extractShopifyCollectionId = base64 => {
		const buffer = Buffer.from(base64, 'base64')
		const shopifyId = buffer.toString('utf-8')
		return shopifyId
	}

	// Decode categories
	categories.forEach(category => {
		decodedIDs.push(extractShopifyCollectionId(category))
	})

	// Filter collections
	const content = collections
		.filter(collection => decodedIDs.includes(collection.id))
		.reverse()

	return (
		<section>
			<div className={`container ${styles.content}`}>
				{title && <h3>{title}</h3>}

				<div className={styles.products}>
					{/* Categories */}
					{content &&
						content.map(item => (
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
