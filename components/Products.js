// styles
import styles from './Products.module.scss'

// components
import Image from 'next/image'
import Link from 'next/link'
import ProductCard from './ProductCard'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

// lib
import {
	getCollections,
	getProducts,
	extractShopifyId,
	getProduct
} from '@/lib/shopify'

const Products = async ({
	title,
	stylizedTitle,
	showTitle,
	type,
	categories,
	products,
	variants,
	threeColumn,
	showPrice,
	discount
}) => {
	const decodedIDs = []
	const items = []
	let content

	// Handling Categories, Products and Variants
	if (categories) {
		// Shopify
		const collections = await getCollections()

		// Decode categories
		categories.forEach(category => {
			decodedIDs.push(extractShopifyId(category))
		})

		// Filter collections
		content = collections
			.filter(collection => decodedIDs.includes(collection.id))
			.reverse()

		// Extract products
		for (const item of content) {
			items.push(...item.products)
		}
	} else if (products) {
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
			<div className={`container ${styles.content}`}>
				{showTitle && stylizedTitle && (
					<div className={`stylizedH3 ${styles.stylizedTitle}`}>
						{documentToReactComponents(stylizedTitle)}
					</div>
				)}
				{showTitle && title && !stylizedTitle && <h3>{title}</h3>}

				<div className={styles.products}>
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
			</div>
		</section>
	)
}

export default Products
