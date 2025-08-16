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

const ProductCard = ({
	permalink,
	discount,
	product,
	individual,
	selectedMetalType
}) => {
	const [metalTypes, setMetalTypes] = useState([])
	const [activeMetalType, setActiveMetalType] = useState('')
	const [showCloseup, setShowCloseup] = useState(false)

	const coverImages = useMemo(() => {
		return (product.images?.edges || []).filter(edge =>
			edge.node.url.toLowerCase().includes('-cover')
		)
	}, [product.images])

	const closeupImages = useMemo(() => {
		return (product.images?.edges || []).filter(edge =>
			edge.node.url.toLowerCase().includes('-closeup')
		)
	}, [product.images])

	const yellowGoldImage = useMemo(() => {
		return coverImages.find(image =>
			image.node.url.toLowerCase().includes('/files/y')
		)
	}, [coverImages])

	const yellowGoldImageCloseup = useMemo(() => {
		return closeupImages.find(image =>
			image.node.url.toLowerCase().includes('/files/y')
		)
	}, [closeupImages])

	const whiteGoldImage = useMemo(() => {
		return coverImages.find(image =>
			image.node.url.toLowerCase().includes('/files/w')
		)
	}, [coverImages])

	const whiteGoldImageCloseup = useMemo(() => {
		return closeupImages.find(image =>
			image.node.url.toLowerCase().includes('/files/w')
		)
	}, [closeupImages])

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
			setActiveMetalType(
				selectedMetalType === 'Yellow' ? metalTypes[0] : metalTypes[1]
			)
		}
	}, [metalTypes, selectedMetalType])

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
				{coverImages.length > 0 && (
					<div
						className={styles.image}
						onMouseEnter={() => {
							if (
								typeof window !== 'undefined' &&
								window.matchMedia('(hover: hover)').matches
							) {
								setShowCloseup(true)
							}
						}}
						onMouseLeave={() => {
							if (
								typeof window !== 'undefined' &&
								window.matchMedia('(hover: hover)').matches
							) {
								setShowCloseup(false)
							}
						}}
					>
						{/* Yellow Gold */}
						<Image
							src={yellowGoldImage?.node.url || coverImages[0]?.node.url}
							fill
							priority={true}
							alt='Category Image.'
							style={{
								visibility: activeMetalType.includes('yellow')
									? 'visible'
									: 'hidden',
								opacity: !showCloseup || !yellowGoldImageCloseup ? 1 : 0,
								objectFit: 'contain',
								objectPosition:
									product.category.name.toLowerCase() === 'necklaces'
										? 'top'
										: 'center'
							}}
							quality={100}
							sizes='(max-width: 768px) 100vw, 50vw'
						/>

						{yellowGoldImageCloseup && (
							<Image
								src={yellowGoldImageCloseup.node.url}
								fill
								alt='Category Image.'
								style={{
									visibility: activeMetalType.includes('yellow')
										? 'visible'
										: 'hidden',
									opacity: showCloseup ? 1 : 0,
									objectFit: 'contain',
									objectPosition:
										product.category.name.toLowerCase() === 'necklaces'
											? 'top'
											: 'center'
								}}
								quality={100}
								sizes='(max-width: 768px) 100vw, 50vw'
							/>
						)}

						{/* White Gold */}
						<Image
							src={whiteGoldImage?.node.url || coverImages[0]?.node.url}
							fill
							alt='Category Image.'
							style={{
								visibility: !activeMetalType.includes('yellow')
									? 'visible'
									: 'hidden',
								opacity: !showCloseup || !whiteGoldImageCloseup ? 1 : 0,
								objectFit: 'contain',
								objectPosition:
									product.category.name.toLowerCase() === 'necklaces'
										? 'top'
										: 'center'
							}}
							quality={100}
							sizes='(max-width: 768px) 100vw, 50vw'
						/>

						{whiteGoldImageCloseup && (
							<Image
								src={whiteGoldImageCloseup.node.url}
								fill
								alt='Category Image.'
								style={{
									visibility: !activeMetalType.includes('yellow')
										? 'visible'
										: 'hidden',
									opacity: showCloseup ? 1 : 0,
									objectFit: 'contain',
									objectPosition:
										product.category.name.toLowerCase() === 'necklaces'
											? 'top'
											: 'center'
								}}
								quality={100}
								sizes='(max-width: 768px) 100vw, 50vw'
							/>
						)}

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
