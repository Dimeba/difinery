'use client'

// styles
import styles from './ProductInfo.module.scss'

// components
import Image from 'next/image'
import ProductOptionsUI from './ProductOptionsUI'

// hooks
import { useState, useMemo } from 'react'

// context
import { useCart } from '@/context/CartContext'

const ProductInfo = ({ product }) => {
	const { cart, addToCart, showCart, setShowCart } = useCart()

	const allImages = product.images.edges.map(edge => edge.node.url)
	const [matchingVariant, setMatchingVariant] = useState(
		product.variants.edges[0].node
	)
	const [selectedColor, setSelectedColor] = useState(null)
	const [engraving, setEngraving] = useState('')
	const [birthStone, setBirthstone] = useState('')
	const [ringSize, setRingSize] = useState('')

	const images = useMemo(() => {
		if (!selectedColor) {
			// No color chosen yet, show all images
			return allImages
		}

		// Decide code letter based on selection (W for White, Y for Yellow)
		const lc = selectedColor.toLowerCase()
		let code = ''
		if (lc.includes('white')) code = 'w'
		else if (lc.includes('yellow')) code = 'y'

		// Filter URLs by matching "/files/{code}" case-insensitively
		return code
			? allImages.filter(url => url.toLowerCase().includes(`/files/${code}`))
			: allImages
	}, [allImages, selectedColor])

	const handleAddToCart = async () => {
		const customFields = []
		if (engraving) customFields.push({ key: 'Engraving', value: engraving })
		if (birthStone) customFields.push({ key: 'Birthstone', value: birthStone })
		if (ringSize) customFields.push({ key: 'Ring Size', value: ringSize })

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
					{images.map((image, index) => (
						<div className={styles.image} key={index}>
							<Image
								src={image}
								fill
								alt='Image of the product.'
								sizes={'(max-width: 768px) 100vw, 50vw'}
								style={{ objectFit: 'cover' }}
							/>
						</div>
					))}
				</div>

				<ProductOptionsUI
					product={product}
					setSelectedColor={setSelectedColor}
					matchingVariant={matchingVariant}
					setMatchingVariant={setMatchingVariant}
					engraving={engraving}
					setEngraving={setEngraving}
					birthStone={birthStone}
					setBirthstone={setBirthstone}
					ringSize={ringSize}
					setRingSize={setRingSize}
				/>
			</div>

			{selectedColor && (
				<div className={styles.finalPreviewContainer} id='addToCart'>
					<div className={`container ${styles.finalPreview}`}>
						<div className={styles.fpImage}>
							<Image
								src={images[0]}
								fill
								alt='Image of the product.'
								sizes={'(max-width: 768px) 100vw, 50vw'}
							/>
						</div>

						<button className={styles.cartButton} onClick={handleAddToCart}>
							Add To Cart
						</button>
					</div>
				</div>
			)}
		</section>
	)
}

export default ProductInfo
