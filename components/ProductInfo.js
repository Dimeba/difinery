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
	const [boxText, setBoxText] = useState('')
	const [boxColor, setBoxColor] = useState('Lavender')
	const [showOrderSummary, setShowOrderSummary] = useState(false)

	const images = useMemo(() => {
		if (!selectedColor) {
			// No color chosen yet, show all images
			return allImages.filter(
				node => !node.url.toLowerCase().includes('-review')
			)
		}

		// Decide code letter based on selection (W for White, Y for Yellow)
		const lc = selectedColor.toLowerCase()
		let code = ''
		if (lc.includes('white')) code = 'w'
		else if (lc.includes('yellow')) code = 'y'

		// Filter URLs by matching "/files/{code}" case-insensitively
		return code
			? allImages.filter(
					node =>
						node.url.toLowerCase().includes(`/files/${code}`) &&
						!node.url.toLowerCase().includes('-review')
			  )
			: allImages.filter(node => !node.url.toLowerCase().includes('-review'))
	}, [allImages, selectedColor])

	const reviewImage = useMemo(() => {
		if (!selectedColor) {
			// No color chosen yet, show all images
			return allImages.find(node => node.url.toLowerCase().includes('-review'))
		}

		const lc = selectedColor.toLowerCase()
		let code = ''
		if (lc.includes('white')) code = 'w'
		else if (lc.includes('yellow')) code = 'y'

		return allImages.find(
			node =>
				node.url.toLowerCase().includes(`/files/${code}`) &&
				node.url.toLowerCase().includes('-review')
		)
	}, [allImages])

	const handleAddToCart = async () => {
		const customFields = []
		if (engraving) customFields.push({ key: 'Engraving', value: engraving })
		if (boxText) customFields.push({ key: 'Box', value: boxText })
		if (boxColor)
			customFields.push({ key: 'Box Message Color', value: boxColor })

		if (!matchingVariant || !matchingVariant.id) {
			console.error('No matching variant found')
			return
		}

		try {
			await addToCart(
				matchingVariant.id,
				1,
				customFields.length ? customFields : []
			)

			// advance your UI steps
			// setOpenOption(prev => prev + 1)
			if (!showCart) setShowCart(true)
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
									style={{ objectFit: isGiftCard ? 'cover' : 'contain' }}
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
					matchingVariant={matchingVariant}
					setMatchingVariant={setMatchingVariant}
					engraving={engraving}
					setEngraving={setEngraving}
					boxText={boxText}
					setBoxText={setBoxText}
					boxColor={boxColor}
					setBoxColor={setBoxColor}
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
						boxText,
						boxColor
					}}
				/>
			)}
		</section>
	)
}

export default ProductInfo
