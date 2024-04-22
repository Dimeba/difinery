// styles
import styles from './Products.module.scss'

// components
import Image from 'next/image'
import Link from 'next/link'

// lib
import { getProduct } from '@/lib/commerce'

// hooks

const ProductCard = async ({ permalink }) => {
	const product = await getProduct(permalink)

	return (
		<div className={styles.product}>
			<Link
				href={`/products/${permalink}`}
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
				</div>
			</Link>
			<h4>{product.name}</h4>
		</div>
	)
}

export default ProductCard
