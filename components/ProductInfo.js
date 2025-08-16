'use client'

// styles
import styles from './ProductInfo.module.scss'

// components
import Image from 'next/image'
import ProductOptionsUI from './ProductOptionsUI'
import OrderReview from './OrderReview'

// hooks
import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

// context
import { useCart } from '@/context/CartContext'

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

	const initialColor = useMemo(
		() =>
			metalOptions.find(opt =>
				opt.name.toLowerCase().includes(gold ? gold.toLowerCase() : '')
			),
		[metalOptions, gold]
	)

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

	const images = useMemo(() => {
		const urlFilter = node => {
			const url = node.url.toLowerCase()
			if (url.includes('-review')) return false

			// Color code
			let matchesColor = true
			if (selectedColor) {
				const lc = selectedColor.toLowerCase()
				const colorCode = lc.includes('white')
					? 'w'
					: lc.includes('yellow')
					? 'y'
					: ''
				if (colorCode) {
					matchesColor = url.includes(`/files/${colorCode}`)
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

			return matchesColor && matchesShape
		}

		return allImages.filter(urlFilter)
	}, [allImages, selectedColor, selectedShape])

	const reviewImage = useMemo(() => {
		const url = node => node.url.toLowerCase()

		const colorCode = selectedColor
			? selectedColor.toLowerCase().includes('white')
				? 'w'
				: selectedColor.toLowerCase().includes('yellow')
				? 'y'
				: ''
			: ''
		const shapeCode = selectedShape
			? selectedShape.toLowerCase().includes('heart')
				? '-hr-'
				: selectedShape.toLowerCase().includes('pear')
				? '-pr-'
				: ''
			: ''

		return allImages.find(node => {
			const u = url(node)
			if (!u.includes('-review')) return false
			const colorOk = colorCode ? u.includes(`/files/${colorCode}`) : true
			const shapeOk = shapeCode ? u.includes(shapeCode) : true
			return colorOk && shapeOk
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
			if (engraving !== '') {
				await addToCart(engravingVariant.id, 1, [
					{ key: 'text', value: engraving },
					{
						key: 'product',
						value: product.title
					}
				])
			}

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

			// advance your UI steps
			// setOpenOption(prev => prev + 1)
			if (product.title === 'Difinery Gift Card') setShowCart(true)
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
									quality={100}
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
