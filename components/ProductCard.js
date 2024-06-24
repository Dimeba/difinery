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
	hideMaterials
}) => {
	const product = await getProduct(id)

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
				<div className={styles.image}>
					<Image
						src={product.images[0].src}
						fill
						alt='Category Image.'
						style={{ objectFit: 'cover' }}
					/>
					{product.images[1] && (
						<Image
							src={product.images[1].src}
							fill
							alt='Category Image.'
							style={{ objectFit: 'cover' }}
							className={styles.hoverImage}
						/>
					)}

					{showPrice && (
						<p className={styles.price}>
							<span
								style={{
									textDecoration: discount ? 'line-through' : '',
									color: discount ? '#AEAEAD' : '#1a1b18'
								}}
							>
								${product.variants[0].price.amount.toString().slice(0, -2)}
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
			</Link>
			<h5>{product.title}</h5>

			{!hideMaterials && (
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
	)
}

export default ProductCard
