// styles
import styles from './Products.module.scss'

// components
import Image from 'next/image'
import Link from 'next/link'

// lib
import { getProduct } from '@/lib/shopify'

const ProductCard = async ({
	permalink,
	id,
	threeColumn,
	showPrice,
	discount,
	hideMaterials,
	variantId,
	secondImagePriority
}) => {
	let product

	// Switching between product and variant
	if (!variantId) {
		product = await getProduct(id)
	} else {
		const productWithVariant = await getProduct(id)
		product = productWithVariant.variants.find(
			variant => variant.id === variantId
		)
	}

	const returnMetalType = option => {
		switch (true) {
			case option.includes('rose'):
				return 'rose.png'
			case option.includes('yellow'):
				return 'yellow.png'
			case option.includes('white'):
				return 'white.png'
			case option.includes('platinum'):
				return 'platinum.png'
			default:
				return ''
		}
	}

	return (
		<div
			className={`${styles.product} ${
				threeColumn ? styles.threeColumn : styles.fourColumn
			}`}
		>
			<Link
				href={`/shop/${permalink}`}
				aria-label={`Link to ${product.title} page.`}
			>
				{secondImagePriority && product.images[1] ? (
					<div className={styles.image}>
						<Image
							src={product.images[1].src}
							fill
							alt='Category Image.'
							style={{ objectFit: 'cover' }}
						/>

						<p className={styles.floatingTitle}>
							<span>{product.title}</span> - From $
							{product.variants[0].price.amount.toString().slice(0, -2)}
						</p>
					</div>
				) : (
					<div className={styles.image}>
						<Image
							src={!variantId ? product.images[0].src : product.image.src}
							fill
							alt='Category Image.'
							style={{ objectFit: 'cover' }}
						/>
						{!variantId && product.images[1] && (
							<Image
								src={product.images[1].src}
								fill
								alt='Category Image.'
								style={{ objectFit: 'cover' }}
								className={styles.hoverImage}
							/>
						)}
					</div>
				)}
			</Link>

			{/* Product Info */}
			{!secondImagePriority && (
				<div className={styles.productInfo}>
					<div className={styles.productTitleContainer}>
						<p className={styles.productTitle}>{product.title}</p>
						{showPrice && (
							<p className={styles.price}>
								<span
									style={{
										textDecoration: discount ? 'line-through' : '',
										color: discount ? '#AEAEAD' : '#1a1b18'
									}}
								>
									From $
									{!variantId
										? product.variants[0].price.amount.toString().slice(0, -2)
										: product.price.amount.toString().slice(0, -2)}
								</span>
								{discount && (
									<>
										{' '}
										<span className={styles.discount}>$200</span>
									</>
								)}
							</p>
						)}
					</div>

					{!hideMaterials && !variantId && (
						<div className={styles.typeIcons}>
							{product.options[1].values.map(option => (
								<div key={option.value} className={styles.typeIcon}>
									<Image
										src={`/${returnMetalType(option.value.toLowerCase())}`}
										fill
										alt={`${option.value} material icon.`}
									/>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default ProductCard
