'use client'

// styles
import styles from './Products.module.scss'

// components
import Image from 'next/image'
import Link from 'next/link'

// hooks
import { useState, useEffect, useMemo } from 'react'

// helpers
import { returnMetalType } from '@/lib/helpers'

const ProductCard = ({ permalink, discount, product, individual }) => {
	const [metalTypes, setMetalTypes] = useState([])
	const [activeMetalType, setActiveMetalType] = useState('')

	// getting png images
	const productImages = useMemo(() => {
		return (product.images?.edges || []).filter(edge =>
			edge.node.url.includes('.png')
		)
	}, [product.images])

	const yellowGoldImage = useMemo(() => {
		return productImages.find(image =>
			image.node.url.toLowerCase().includes('/files/y')
		)
	}, [productImages])

	const whiteGoldImage = useMemo(() => {
		return productImages.find(image =>
			image.node.url.toLowerCase().includes('/files/w')
		)
	}, [productImages])

	// Function to return the correct image based on active metal type
	const returnCorrectImage = () => {
		if (!activeMetalType) {
			return productImages[0]?.node.url
		}

		return activeMetalType.includes('yellow')
			? yellowGoldImage?.node.url
			: whiteGoldImage?.node.url
	}

	// Function to return the correct URL based on active metal type
	const returnCorrectURL = () => {
		if (!activeMetalType) {
			return `/shop/${product.category.name.toLowerCase()}/${permalink}`
		}

		return {
			pathname: `/shop/${product.category.name.toLowerCase()}/${permalink}`,
			query: {
				gold: activeMetalType.includes('yellow') ? 'yellow' : 'white'
			}
		}
	}

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

	useEffect(() => {
		if (metalTypes.length > 0) {
			setActiveMetalType(metalTypes[0])
		}
	}, [metalTypes])

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
				href={returnCorrectURL()}
				aria-label={`Link to ${product.title} page.`}
			>
				{productImages.length > 0 && (
					<div className={styles.image}>
						<Image
							src={returnCorrectImage()}
							fill
							alt='Category Image.'
							style={{ objectFit: 'cover' }}
							sizes='(max-width: 768px) 100vw, 50vw'
						/>

						{individual && (
							<p className={styles.individualTitle}>
								<span>{product.title}</span>
								<br />
								{Number(
									product.priceRange.minVariantPrice.amount.slice(0, -2)
								).toLocaleString()}
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
								From $
								{Number(
									product.priceRange.minVariantPrice.amount.slice(0, -2)
								).toLocaleString()}
							</span>
						</p>
					</div>

					{/* Metal */}
					{metalTypes.length > 0 && (
						<div className={styles.typeIcons}>
							{metalTypes.map(option => (
								<div
									key={option}
									className={styles.typeIcon}
									onClick={() => setActiveMetalType(option)}
								>
									<Image
										src={`/${option}`}
										fill
										alt={`${option} material icon.`}
										sizes='(max-width: 768px) 100vw, 50vw'
									/>

									{activeMetalType === option && (
										<div className={styles.typeCircle}></div>
									)}
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
