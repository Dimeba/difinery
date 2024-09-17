'use client'

// styles
import styles from './Products.module.scss'

// components
import Image from 'next/image'
import Link from 'next/link'

// hooks
import { useState, useEffect } from 'react'

// lib
import { getProduct } from '@/lib/shopify'

const ProductCard = ({ permalink, id, discount }) => {
	const [product, setProduct] = useState({})

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const productData = await getProduct(id)
				setProduct(productData)
			} catch (error) {
				console.error('Error fetching product:', error)
			}
		}

		fetchProduct()
	}, [id])

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

	if (!product) {
		return (
			<div className={styles.product}>
				<p>Loading...</p>
			</div>
		)
	}

	const metal = product.options?.find(option => option.name === 'Metal')

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
				{metal && (
					<div className={styles.typeIcons}>
						{metal.values.map(option => (
							<div key={option.value} className={styles.typeIcon}>
								<Image
									src={`/${returnMetalType(option.value.toLowerCase())}`}
									fill
									alt={`${option.value} material icon.`}
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
