// styles
import styles from './Products.module.scss'

// components
import Image from 'next/image'
import Link from 'next/link'

// lib
import { getProduct } from '@/lib/commerce'

const ProductCard = async ({ permalink, threeColumn, showPrice }) => {
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
						<p className={styles.price}>${product.price.formatted}</p>
					)}
				</div>
			</Link>
			<h5>{product.name}</h5>

			{metalTypeGroup && (
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
