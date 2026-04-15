'use client'

// styles
import styles from './ProductInfo.module.scss'
import mediaStyles from './ProductMediaPanel.module.scss'

// components
import ProductOptionsUI from './ProductOptionsUI'
import OrderReview from './OrderReview'
import ProductImageGallery from './ProductImageGallery'
import ProductIframeViewer from './ProductIframeViewer'

// hooks
import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

// context
import { useCart } from '@/context/CartContext'

// analytics
import { trackViewItem, trackAddToCart } from '@/lib/gaEvents'

// data
import iJewelData from '@/data/iJewelData.json' with { type: 'json' }

const ProductInfo = ({ product, isGiftCard = false }) => {
	const { cart, addToCart, showCart, setShowCart } = useCart()

	// Product can be temporarily undefined during navigation/loading.
	const allImages = useMemo(() => {
		return product?.images?.edges
			? product.images.edges.map(edge => edge.node)
			: []
	}, [product?.images?.edges])

	// Getting the default metal type
	const searchParams = useSearchParams()
	const gold = searchParams.get('gold')

	const metalOptions = useMemo(() => {
		const options = product?.options || []
		const metal = options.find(opt => opt?.name === 'Metal')
		return metal?.optionValues || []
	}, [product?.options])

	const initialColor = useMemo(() => {
		const normalizedGold = gold ? gold.toLowerCase().replace(/-/g, ' ') : ''
		if (!normalizedGold) return null

		// First: direct inclusion match (works for single colors, e.g. "yellow" → "Yellow Gold")
		const directMatch = metalOptions.find(opt =>
			(opt?.name || '').toLowerCase().includes(normalizedGold)
		)
		if (directMatch) return directMatch

		// Fallback for combinations like "yellow-and-white" → ["yellow", "white"]:
		// check that every color word appears in the option name (handles "&" vs "and")
		const colorWords = normalizedGold.split(/\s+and\s+/).map(s => s.trim()).filter(Boolean)
		if (colorWords.length > 1) {
			return (
				metalOptions.find(opt => {
					const lower = (opt?.name || '').toLowerCase()
					return colorWords.every(word => lower.includes(word))
				}) || null
			)
		}

		return null
	}, [metalOptions, gold])

	const [matchingVariant, setMatchingVariant] = useState(
		product?.variants?.edges?.[0]?.node || null
	)
	const [selectedColor, setSelectedColor] = useState(
		gold ? initialColor?.name || null : null
	)
	const [engraving, setEngraving] = useState('')
	const [engravingVariant, setEngravingVariant] = useState(null)
	const [boxText, setBoxText] = useState('')
	const [boxVariant, setBoxVariant] = useState(null)
	const [showOrderSummary, setShowOrderSummary] = useState(false)
	const [selectedShape, setSelectedShape] = useState(null)
	const [show3DModel, setShow3DModel] = useState(false)

	// Track view_item event when product loads or variant changes
	useEffect(() => {
		if (product && matchingVariant) {
			trackViewItem(product, matchingVariant)
		}
	}, [product, matchingVariant])

	useEffect(() => {
		if (!matchingVariant && product?.variants?.edges?.[0]?.node) {
			setMatchingVariant(product.variants.edges[0].node)
		}
	}, [product, matchingVariant])

	const modelId = useMemo(() => {
		const sku = (matchingVariant?.sku || '').trim()
		if (!sku) return ''

		const model = iJewelData.find(item => item.SKU === sku)
		return (model?.['3Did'] || '').trim()
	}, [matchingVariant?.sku])

	const has3DModel = Boolean(modelId)

	useEffect(() => {
		// Always default to image gallery on variant change.
		setShow3DModel(false)
	}, [matchingVariant?.sku])

	const images = useMemo(() => {
		const urlFilter = node => {
			const url = node.url.toLowerCase()
			if (url.includes('-review')) return false

			// Extract filename from URL
			const filename = url.split('/').pop()

			// Color / Stackable logic
			let matchesColorOrStackable = true
			if (selectedColor) {
				const lc = selectedColor.toLowerCase()

				// Check if this is a stackable ring with color codes (e.g., "Stackable-YR")
				if (lc.startsWith('stackable-')) {
					const colorCodes = lc.replace('stackable-', '').toLowerCase()

					// Match exact color code pattern only
					const matches = url.includes(`stackable-${colorCodes}`)

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

		let filteredImages = allImages.filter(urlFilter)

		// If stackable and no exact matches found, try reversed order
		if (
			filteredImages.length === 0 &&
			selectedColor?.toLowerCase().startsWith('stackable-')
		) {
			const colorCodes = selectedColor.toLowerCase().replace('stackable-', '')
			const reversedCodes = colorCodes.split('').reverse().join('')

			const reversedFilter = node => {
				const url = node.url.toLowerCase()
				if (url.includes('-review')) return false

				const matches = url.includes(`stackable-${reversedCodes}`)

				// Shape matching
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

				return matches && matchesShape
			}

			filteredImages = allImages.filter(reversedFilter)
		}

		// Final fallback: never return an empty image list.
		if (filteredImages.length === 0) {
			return allImages
		}

		return filteredImages
	}, [allImages, selectedColor, selectedShape])

	const reviewImage = useMemo(() => {
		const toLower = node => node.url.toLowerCase()

		// Determine selection codes
		const lc = selectedColor ? selectedColor.toLowerCase() : ''
		const isStackable = lc.includes('stackable')
		const hasWhite = lc.includes('white')
		const hasYellow = lc.includes('yellow')
		const hasRose = lc.includes('rose')

		// Stackable codes: prefer exact Review-Stackable-<codes> match
		if (lc.startsWith('stackable-')) {
			const codes = lc.replace('stackable-', '')
			let img = allImages.find(node => {
				const u = toLower(node)
				return u.includes('-review') && u.includes(`review-stackable-${codes}`)
			})
			if (!img && codes.length === 2) {
				const reversed = codes.split('').reverse().join('')
				img = allImages.find(node => {
					const u = toLower(node)
					return (
						u.includes('-review') && u.includes(`review-stackable-${reversed}`)
					)
				})
			}
			return img || null
		}

		// Determine the metal prefix
		let metalPrefix = ''
		if (isStackable && hasWhite && hasYellow) {
			metalPrefix = 'mr-' // mixed stackable
		} else if (hasWhite) {
			metalPrefix = 'wr-' // white gold
		} else if (hasYellow) {
			metalPrefix = 'yr-' // yellow gold
		} else if (hasRose) {
			metalPrefix = 'rr-' // rose gold
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
				<div className={mediaStyles.mediaPanel}>
					{has3DModel && (
						<button
							type='button'
							className={mediaStyles.viewerModeToggle}
							onClick={() => setShow3DModel(prev => !prev)}
							aria-label={
								show3DModel ? 'Show product images' : 'Show 3D model viewer'
							}
							title={show3DModel ? 'Show images' : 'Show 3D model'}
						>
							{show3DModel ? (
								<svg viewBox='0 0 24 24' aria-hidden='true'>
									<path d='M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1 2v10h14V7H5zm2 8 3-4 2 2 3-3 2 5H7z' />
								</svg>
							) : (
								<svg viewBox='0 0 24 24' aria-hidden='true'>
									<path d='M12 2 3 7v10l9 5 9-5V7l-9-5zm0 2.2 6.6 3.7L12 11.6 5.4 7.9 12 4.2zM5 9.6l6 3.4v6.3l-6-3.3V9.6zm8 9.7V13l6-3.4V16l-6 3.3z' />
								</svg>
							)}
						</button>
					)}

					{show3DModel && has3DModel ? (
						<ProductIframeViewer modelId={modelId} sku={matchingVariant?.sku} />
					) : (
						<ProductImageGallery images={images} isGiftCard={isGiftCard} />
					)}
				</div>

				{product && (
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
				)}
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
