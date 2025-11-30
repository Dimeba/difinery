'use client'

// styles
import styles from './ProductInfo.module.scss'

// components
import Image from 'next/image'
import ProductOptionsUI from './ProductOptionsUI'
import OrderReview from './OrderReview'

// hooks
import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

// context
import { useCart } from '@/context/CartContext'

// analytics
import { trackViewItem, trackAddToCart } from '@/lib/gaEvents'

const ProductInfo = ({ product, isGiftCard = false }) => {
	const { cart, addToCart, showCart, setShowCart } = useCart()

	const allImages = product.images.edges.map(edge => edge.node)

	// Getting the default metal type
	const searchParams = useSearchParams()
	const gold = searchParams.get('gold')

	const metalOptions = useMemo(() => {
		const metal = product.options.find(opt => opt.name === 'Metal')
		return metal ? metal.optionValues : []
	}, [product.options])

	const initialColor = useMemo(() => {
		const normalizedGold = gold ? gold.toLowerCase().replace(/-/g, ' ') : ''
		return metalOptions.find(opt =>
			opt.name.toLowerCase().includes(normalizedGold)
		)
	}, [metalOptions, gold])

	const [matchingVariant, setMatchingVariant] = useState(
		product.variants.edges[0].node
	)
	const [selectedColor, setSelectedColor] = useState(
		gold ? initialColor.name : null
	)
	const [engraving, setEngraving] = useState('')
	const [engravingVariant, setEngravingVariant] = useState(null)
	const [boxText, setBoxText] = useState('')
	const [boxVariant, setBoxVariant] = useState(null)
	const [showOrderSummary, setShowOrderSummary] = useState(false)
	const [selectedShape, setSelectedShape] = useState(null)

	// Track view_item event when product loads or variant changes
	useEffect(() => {
		if (product && matchingVariant) {
			trackViewItem(product, matchingVariant)
		}
	}, [product, matchingVariant])

	const images = useMemo(() => {
		const urlFilter = node => {
			const url = node.url.toLowerCase()
			if (url.includes('-review')) return false

			// Extract filename from URL
			const filename = url.split('/').pop()

			// Log all images for stackable rings
			if (selectedColor?.toLowerCase().startsWith('stackable-')) {
				console.log('Checking image:', filename)
			}

			// Color / Stackable logic
			let matchesColorOrStackable = true
			if (selectedColor) {
				const lc = selectedColor.toLowerCase()

				// Check if this is a stackable ring with color codes (e.g., "Stackable-WYR")
				if (lc.startsWith('stackable-')) {
					const colorCodes = lc.replace('stackable-', '').toLowerCase()

					// Match pattern like "stackable-yr" or "Stackable-YR" in the filename
					// Try both the original order and reversed order for 2-ring combinations
					const reversedCodes = colorCodes.split('').reverse().join('')

					// Since url is already lowercase, just check lowercase patterns
					const matches =
						url.includes(`stackable-${colorCodes}`) ||
						url.includes(`stackable-${reversedCodes}`)

					if (!matches) {
						console.log(
							'Image filtered out:',
							filename,
							'Looking for:',
							colorCodes.toUpperCase(),
							'or',
							reversedCodes.toUpperCase()
						)
					} else {
						console.log('IMAGE MATCHED:', filename)
					}
					matchesColorOrStackable = matches
				} else {
					const hasWhite = lc.includes('white')
					const hasYellow = lc.includes('yellow')
					const hasRose = lc.includes('rose')

					// Determine the metal prefix
					let metalPrefix = ''
					if (hasWhite && hasYellow) {
						metalPrefix = 'mr-' // mixed stackable
					} else if (hasWhite) {
						metalPrefix = 'w' // white gold
					} else if (hasYellow) {
						metalPrefix = 'y' // yellow gold
					} else if (hasRose) {
						metalPrefix = 'r' // rose gold
					}

					if (metalPrefix) {
						matchesColorOrStackable = filename.startsWith(metalPrefix)
					}
				}
			}

			// Shape code
			let matchesShape = true
			if (selectedShape) {
				const sc = selectedShape.toLowerCase()
				const shapeCode = sc.includes('heart')
					? '-hr-'
					: sc.includes('pear')
					? '-pr-'
					: ''
				if (shapeCode) {
					matchesShape = url.includes(shapeCode)
				}
			}

			return matchesColorOrStackable && matchesShape
		}

		return allImages.filter(urlFilter)
	}, [allImages, selectedColor, selectedShape])

	const reviewImage = useMemo(() => {
		const toLower = node => node.url.toLowerCase()

		// Determine selection codes
		const lc = selectedColor ? selectedColor.toLowerCase() : ''
		const isStackable = lc.includes('stackable')
		const hasWhite = lc.includes('white')
		const hasYellow = lc.includes('yellow')

		// Determine the metal prefix
		let metalPrefix = ''
		if (isStackable && hasWhite && hasYellow) {
			metalPrefix = 'mr-' // mixed stackable
		} else if (hasWhite) {
			metalPrefix = 'wr-' // white gold
		} else if (hasYellow) {
			metalPrefix = 'yr-' // yellow gold
		}

		const shapeCode = selectedShape
			? selectedShape.toLowerCase().includes('heart')
				? '-hr-'
				: selectedShape.toLowerCase().includes('pear')
				? '-pr-'
				: ''
			: ''

		return allImages.find(node => {
			const u = toLower(node)
			const filename = u.split('/').pop()
			if (!u.includes('-review')) return false
			const metalOk = metalPrefix ? filename.startsWith(metalPrefix) : true
			const shapeOk = shapeCode ? u.includes(shapeCode) : true
			return metalOk && shapeOk
		})
	}, [allImages, selectedColor, selectedShape])

	const handleAddToCart = async () => {
		const customFields = []
		if (engraving)
			customFields.push({ key: 'Engraving Text', value: engraving })
		if (boxText) customFields.push({ key: 'Box Text', value: boxText })

		if (!matchingVariant || !matchingVariant.id) {
			console.error('No matching variant found')
			return
		}

		try {
			// Engraving is now added as custom field only, not as separate product
			// if (engraving !== '') {
			// 	await addToCart(engravingVariant.id, 1, [
			// 		{ key: 'text', value: engraving },
			// 		{
			// 			key: 'product',
			// 			value: product.title
			// 		}
			// 	])
			// }

			if (boxText !== '') {
				await addToCart(boxVariant.id, 1, [
					{ key: 'text', value: boxText },
					{
						key: 'product',
						value: product.title
					}
				])
			}

			await addToCart(
				matchingVariant.id,
				1,
				customFields.length ? customFields : []
			)

			// Track add_to_cart event
			trackAddToCart(product, matchingVariant, 1)

			// Show cart for gift cards
			if (isGiftCard) {
				setShowCart(true)
			}
		} catch (err) {
			console.error('Add to cart mutation failed', err)
		}
	}

	return (
		<section className='topSection'>
			<div className={styles.productInfo}>
				<div className={styles.images}>
					{images.map((image, index) => {
						const steps = images.length > 1 ? images.length - 1 : 1
						const alpha = 0.03 + (index / steps) * 0.05
						return (
							<div
								className={styles.image}
								key={index}
								style={{
									backgroundColor: `rgba(0, 0, 0, ${alpha.toFixed(2)})`
								}}
							>
								<Image
									src={image.url}
									fill
									alt='Image of the product.'
									priority={index === 0}
									loading={index === 0 ? undefined : 'lazy'}
									quality={75}
									sizes='(max-width: 768px) 100vw, 50vw'
									style={{
										objectFit:
											isGiftCard || image.url.includes('.jpg')
												? 'cover'
												: 'contain'
									}}
								/>
							</div>
						)
					})}
				</div>

				<ProductOptionsUI
					product={product}
					isGiftCard={isGiftCard}
					selectedColor={selectedColor}
					setSelectedColor={setSelectedColor}
					selectedShape={selectedShape}
					setSelectedShape={setSelectedShape}
					matchingVariant={matchingVariant}
					setMatchingVariant={setMatchingVariant}
					engraving={engraving}
					setEngraving={setEngraving}
					setEngravingVariant={setEngravingVariant}
					boxText={boxText}
					setBoxText={setBoxText}
					boxVariant={boxVariant}
					setBoxVariant={setBoxVariant}
					setShowOrderSummary={setShowOrderSummary}
					handleAddToCart={handleAddToCart}
				/>
			</div>

			{showOrderSummary && (
				<OrderReview
					image={reviewImage ? reviewImage : images[0]}
					handleAddToCart={handleAddToCart}
					matchingVariant={matchingVariant}
					product={product}
					customOptions={{
						engraving,
						boxText
					}}
				/>
			)}
		</section>
	)
}

export default ProductInfo
