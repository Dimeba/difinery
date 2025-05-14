'use client'

// styles
import styles from './Products.module.scss'

// components
import Image from 'next/image'
import Link from 'next/link'

// hooks
import { useState, useEffect } from 'react'

// helpers
import { returnMetalType } from '@/lib/helpers'

const ProductCard = ({ permalink, discount, product, individual }) => {
	const [metalTypes, setMetalTypes] = useState([])

	useEffect(() => {
		const types = new Set()

		product.options?.forEach(option => {
			if (option.name === 'Metal') {
				option.values.forEach(value => {
					const image = returnMetalType(value.toLowerCase())
					if (image) {
						types.add(image)
					}
				})
			}
		})

		setMetalTypes([...types])
	}, [product])

	if (!product) {
		return (
			<div className={styles.product}>
				<p>Loading...</p>
			</div>
		)
	}

	return (
		<div className={`${!individual ? styles.product : styles.productNoGap}`}>
			<Link
				href={`/shop/${permalink}`}
				aria-label={`Link to ${product.title} page.`}
			>
				{/* Product Image */}
				{product.images && (
					<div className={styles.image}>
						{!individual ? (
							<>
								<Image
									src={product.images.edges[0].node.url}
									fill
									alt='Category Image.'
									style={{ objectFit: 'cover' }}
									sizes='(max-width: 768px) 100vw, 50vw'
								/>
								{product.images[1] && (
									<Image
										src={product.images.edges[1].node.url}
										fill
										alt='Category Image.'
										style={{ objectFit: 'cover' }}
										className={styles.hoverImage}
										sizes='(max-width: 768px) 100vw, 50vw'
									/>
								)}
							</>
						) : (
							<>
								{product.images[1] ? (
									<Image
										src={product.images.edges[1].node.url}
										fill
										alt='Category Image.'
										style={{ objectFit: 'cover' }}
										sizes='(max-width: 768px) 100vw, 50vw'
									/>
								) : (
									<Image
										src={product.images.edges[0].node.url}
										fill
										alt='Category Image.'
										style={{ objectFit: 'cover' }}
										sizes='(max-width: 768px) 100vw, 50vw'
									/>
								)}
							</>
						)}

						{individual && (
							<p className={styles.individualTitle}>
								<span>{product.title}</span> - From $
								{Math.min(
									...product.variants.map(variant =>
										parseFloat(variant.price.amount)
									)
								)}
							</p>
						)}
					</div>
				)}
			</Link>

			{/* Product Info */}
			{!individual && (
				<div className={styles.productInfo}>
					<div className={styles.productTitleContainer}>
						<p className={styles.productTitle}>{product.title}</p>
						<p className={styles.price}>
							<span
								style={{
									textDecoration: discount ? 'line-through' : '',
									color: discount ? '#AEAEAD' : '#1a1b18'
								}}
							>
								From ${parseFloat(product.priceRange.minVariantPrice.amount)}
							</span>
						</p>
					</div>

					{/* Metal */}
					{metalTypes.length > 0 && (
						<div className={styles.typeIcons}>
							{metalTypes.map(option => (
								<div key={option} className={styles.typeIcon}>
									<Image
										src={`/${option}`}
										fill
										alt={`${option} material icon.`}
										sizes='(max-width: 768px) 100vw, 50vw'
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
