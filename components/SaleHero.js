// styles
import styles from './SaleHero.module.scss'

// components
import Image from 'next/image'
import ProductCard from './ProductCard'

// lib
import { getProducts, extractShopifyId } from '@/lib/shopify'

const SaleHero = async ({ products, image, title, text }) => {
	const decodedIDs = []
	const items = []
	let content

	// Extract Shopify ID from base64

	if (products) {
		// Shopify
		const shopifyProducts = await getProducts()

		// Decode products
		products.forEach(product => {
			decodedIDs.push(extractShopifyId(product))
		})

		// Filter products
		content = shopifyProducts
			.filter(product => decodedIDs.includes(product.id))
			.reverse()

		// Extract products
		for (const item of content) {
			items.push(item)
		}
	} else if (variants) {
		// Add code here
	}

	return (
		<section>
			<div className={`container ${styles.saleHero}`}>
				<div className={styles.collection}>
					<div className={styles.image}>
						<Image
							src={image ? 'https:' + image : '/sample-image1.jpg'}
							fill
							alt='Collection Preview'
							style={{ objectFit: 'cover' }}
						/>
					</div>

					<h5>{title}</h5>
					<p>{text}</p>
				</div>

				{products &&
					items.map(product => (
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
