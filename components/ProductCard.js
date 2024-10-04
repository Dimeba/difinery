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

const ProductCard = ({ permalink, discount, product }) => {
	const [metalTypes, setMetalTypes] = useState([])

	useEffect(() => {
		const types = new Set()

		product.options?.forEach(option => {
			if (option.name === 'Metal') {
				option.values.forEach(value => {
					const image = returnMetalType(value.value.toLowerCase())
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
		<div className={styles.product}>
			<Link
				href={`/shop/${permalink}`}
				aria-label={`Link to ${product.title} page.`}
			>
				{/* Product Image */}
				{product.images && (
					<div className={styles.image}>
						<Image
							src={product.images[0].src}
							fill
							alt='Category Image.'
							style={{ objectFit: 'cover' }}
							sizes='(max-width: 768px) 100vw, 50vw'
						/>
						{product.images[1] && (
							<Image
								src={product.images[1].src}
								fill
								alt='Category Image.'
								style={{ objectFit: 'cover' }}
								className={styles.hoverImage}
								sizes='(max-width: 768px) 100vw, 50vw'
							/>
						)}
					</div>
				)}
			</Link>

			{/* Product Info */}
			<div className={styles.productInfo}>
				<div className={styles.productTitleContainer}>
					<p className={styles.productTitle}>{product.title}</p>
					<p className={styles.price}>
						{product.variants && (
							<span
								style={{
									textDecoration: discount ? 'line-through' : '',
									color: discount ? '#AEAEAD' : '#1a1b18'
								}}
							>
								From $
								{Math.min(
									...product.variants.map(variant =>
										parseFloat(variant.price.amount)
									)
								)}
							</span>
						)}
						{discount && (
							<>
								{' '}
								<span className={styles.discount}>$200</span>
							</>
						)}
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
		</div>
	)
}

export default ProductCard
