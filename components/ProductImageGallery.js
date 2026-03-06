'use client'

import Image from 'next/image'
import styles from './ProductMediaPanel.module.scss'

const ProductImageGallery = ({ images = [], isGiftCard = false }) => {
	return (
		<div
			className={styles.images}
			style={{
				backgroundColor: 'rgba(0, 0, 0, 0.03)'
			}}
		>
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
									isGiftCard || image.url.includes('.jpg') ? 'cover' : 'contain'
							}}
						/>
					</div>
				)
			})}
		</div>
	)
}

export default ProductImageGallery
