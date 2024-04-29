// styles
import styles from './Products.module.scss'

// components
import Image from 'next/image'
import Link from 'next/link'

// lib
import { getProduct } from '@/lib/commerce'

const ProductCard = async ({
	permalink,
	threeColumn,
	showPrice,
	discount,
	hideMaterials
}) => {
	const product = await getProduct(permalink)

	const metalTypeGroup =
		product.variant_groups.find(group => group.name === 'Metal Type') || null

	return (
		<div
			className={`${styles.product} ${
				threeColumn ? styles.threeColumn : styles.fourColumn
			}`}
		>
			<Link
				href={`/shop/${permalink}`}
				aria-label={`Link to ${product.name} page.`}
			>
				<div className={styles.image}>
					<Image
						src={product.assets[0].url}
						fill
						alt='Category Image.'
						style={{ objectFit: 'cover' }}
					/>
					{product.assets[1] && (
						<Image
							src={product.assets[1].url}
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
								${product.price.formatted}
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
			<h5>{product.name}</h5>

			{metalTypeGroup && !hideMaterials && (
				<div className={styles.typeIcons}>
					{metalTypeGroup.options.map(option => (
						<div key={option.name} className={styles.typeIcon}>
							<Image
								src={`/${option.name.toLowerCase()}.png`}
								fill
								alt={`${option.name} material icon.`}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default ProductCard
