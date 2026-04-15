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

// analytics
import { trackSelectItem } from '@/lib/gaEvents'

const ProductCard = ({
	permalink,
	discount,
	product,
	individual,
	collectionHandle,
	selectedMetalType,
	index = 0,
	listName = 'Shop'
}) => {
	// Initialize metal types and active type immediately
	const initialMetalTypes = useMemo(() => {
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
		return [...types]
	}, [product])

	// Find the matching metal type based on selectedMetalType immediately
	const initialActiveType = useMemo(() => {
		if (initialMetalTypes.length === 0) return ''

		const matchingType = initialMetalTypes.find(type => {
			if (selectedMetalType === 'Yellow Gold') {
				return type.includes('yellow')
			} else if (selectedMetalType === 'White Gold') {
				return type.includes('white') && !type.includes('yellow')
			} else if (selectedMetalType === 'Multi Gold') {
				return type.includes('multi')
			}
			return false
		})

		return matchingType || initialMetalTypes[0]
	}, [initialMetalTypes, selectedMetalType])

	const [metalTypes, setMetalTypes] = useState(initialMetalTypes)
	const [activeMetalType, setActiveMetalType] = useState(initialActiveType)

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

	const multiGoldImage = useMemo(() => {
		return coverImages.find(image =>
			image.node.url.toLowerCase().includes('/files/m')
		)
	}, [coverImages])

	const multiGoldImageCloseup = useMemo(() => {
		return closeupImages.find(image =>
			image.node.url.toLowerCase().includes('/files/m')
		)
	}, [closeupImages])

	const roseGoldImage = useMemo(() => {
		return coverImages.find(image =>
			image.node.url.toLowerCase().includes('/files/r')
		)
	}, [coverImages])

	const roseGoldImageCloseup = useMemo(() => {
		return closeupImages.find(image =>
			image.node.url.toLowerCase().includes('/files/r')
		)
	}, [closeupImages])

	// Function to return the correct URL based on active metal type
	const returnCorrectURL = () => {
		// Strip '-collection' and everything after if present in permalink
		// const cleanedPermalink = permalink.includes('-collection')
		// 	? permalink.split('-collection')[0]
		// 	: permalink

		if (!activeMetalType) {
			const base = {
				pathname: `/shop/${product.category.name.toLowerCase()}/product/${permalink}`
			}

			// Only add query if permalink references a collection variant
			if (permalink.includes('-collection-')) {
				let gold
				if (permalink.includes('-collection-yellow')) {
					gold = 'yellow'
				} else if (permalink.includes('-collection-white')) {
					gold = 'white'
				} else if (permalink.includes('-collection-multi')) {
					gold = 'yellow-and-white'
				}

				if (gold) {
					base.query = { gold }
				}
			}

			return base
		}

		const query = {
			gold: activeMetalType.toLocaleLowerCase().includes('yellow')
				? 'yellow'
				: activeMetalType.toLocaleLowerCase().includes('multi')
					? 'yellow-and-white'
					: activeMetalType.toLocaleLowerCase().includes('rose')
						? 'rose'
						: 'white'
		}

		if (collectionHandle) {
			query.collection = collectionHandle
		}

		return {
			pathname: `/shop/${product.category.name.toLowerCase()}/product/${permalink}`,
			query
		}
	}

	// Sync if product changes (rarely happens)
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

		const newTypes = [...types]
		if (JSON.stringify(newTypes) !== JSON.stringify(metalTypes)) {
			setMetalTypes(newTypes)

			// Update active type if needed
			const matchingType = newTypes.find(type => {
				if (selectedMetalType === 'Yellow Gold') {
					return type.includes('yellow')
				} else if (selectedMetalType === 'White Gold') {
					return type.includes('white') && !type.includes('yellow')
				} else if (selectedMetalType === 'Multi Gold') {
					return type.includes('multi')
				}
				return false
			})

			setActiveMetalType(matchingType || newTypes[0])
		}
	}, [product, selectedMetalType, metalTypes])

	if (!product) {
		return (
			<div className={styles.product}>
				<p>Loading...</p>
			</div>
		)
	}

	const handleProductClick = () => {
		// Track select_item event when product is clicked
		trackSelectItem(product, listName, index)
	}

	return (
		<div className={`${!individual ? styles.product : styles.productNoGap}`}>
			<Link
				href={returnCorrectURL()}
				aria-label={`Link to ${product.title} page.`}
				onClick={handleProductClick}
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
							priority={index < 4}
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
							quality={75}
							sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
						/>

						{yellowGoldImageCloseup && (
							<Image
								src={yellowGoldImageCloseup.node.url}
								fill
								loading='lazy'
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
								quality={75}
								sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
							/>
						)}

						{/* White Gold */}
						<Image
							src={whiteGoldImage?.node.url || coverImages[0]?.node.url}
							fill
							loading='lazy'
							alt='Category Image.'
							style={{
								visibility:
									!activeMetalType.includes('yellow') &&
									!activeMetalType.includes('multi')
										? 'visible'
										: 'hidden',
								opacity: !showCloseup || !whiteGoldImageCloseup ? 1 : 0,
								objectFit: 'contain',
								objectPosition:
									product.category.name.toLowerCase() === 'necklaces'
										? 'top'
										: 'center'
							}}
							quality={75}
							sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
						/>

						{whiteGoldImageCloseup && (
							<Image
								src={whiteGoldImageCloseup.node.url}
								fill
								loading='lazy'
								alt='Category Image.'
								style={{
									visibility:
										!activeMetalType.includes('yellow') &&
										!activeMetalType.includes('multi')
											? 'visible'
											: 'hidden',
									opacity: showCloseup ? 1 : 0,
									objectFit: 'contain',
									objectPosition:
										product.category.name.toLowerCase() === 'necklaces'
											? 'top'
											: 'center'
								}}
								quality={75}
								sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
							/>
						)}

						{/* Multi Gold */}
						<Image
							src={multiGoldImage?.node.url || coverImages[0]?.node.url}
							fill
							loading='lazy'
							alt='Category Image.'
							style={{
								visibility: activeMetalType.includes('multi')
									? 'visible'
									: 'hidden',
								opacity: !showCloseup || !multiGoldImageCloseup ? 1 : 0,
								objectFit: 'contain',
								objectPosition:
									product.category.name.toLowerCase() === 'necklaces'
										? 'top'
										: 'center'
							}}
							quality={75}
							sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
						/>

						{multiGoldImageCloseup && (
							<Image
								src={multiGoldImageCloseup.node.url}
								fill
								loading='lazy'
								alt='Category Image.'
								style={{
									visibility: activeMetalType.includes('multi')
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

						{/* Rose Gold */}
						<Image
							src={roseGoldImage?.node.url || coverImages[0]?.node.url}
							fill
							loading='lazy'
							alt='Category Image.'
							style={{
								visibility: activeMetalType.includes('rose')
									? 'visible'
									: 'hidden',
								opacity: !showCloseup || !roseGoldImageCloseup ? 1 : 0,
								objectFit: 'contain',
								objectPosition:
									product.category.name.toLowerCase() === 'necklaces'
										? 'top'
										: 'center'
							}}
							quality={75}
							sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
						/>

						{roseGoldImageCloseup && (
							<Image
								src={roseGoldImageCloseup.node.url}
								fill
								loading='lazy'
								alt='Category Image.'
								style={{
									visibility: activeMetalType.includes('rose')
										? 'visible'
										: 'hidden',
									opacity: showCloseup ? 1 : 0,
									objectFit: 'contain',
									objectPosition:
										product.category.name.toLowerCase() === 'necklaces'
											? 'top'
											: 'center'
								}}
								quality={75}
								sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
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
										sizes='30px'
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
