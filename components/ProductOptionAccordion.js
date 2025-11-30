'use client'

// styles
import styles from './ProductInfo.module.scss'

// components
import Image from 'next/image'
import Accordion from './Accordion'
import GiftCardInput from './GiftCardInput'
import { Typography } from '@mui/material'

// helpers
import { returnMetalType, returnDiamondShape } from '@/lib/helpers'

// hooks
import { useMediaQuery } from '@mui/material'

const ProductOptionAccordion = ({
	option,
	index,
	product,
	selectedOptions,
	handleOptionSelection,
	handleDisplayUpdate,
	openOption,
	setOpenOption,
	isGiftCard = false,
	isMobile = false,
	// Custom shape props
	isCustomShape = false,
	customShapes = [],
	extraTitleText = null
}) => {
	return (
		<Accordion
			key={option?.name || 'custom-shape'}
			title={isCustomShape ? 'Diamond Shape' : option.name}
			extraTitleText={
				isCustomShape
					? extraTitleText
					: selectedOptions[option.name]
					? isGiftCard
						? selectedOptions[option.name].replace(
								/^(\$)(\d)(\d{3})$/,
								'$1$2,$3'
						  )
						: selectedOptions[option.name]
					: null
			}
			state={
				isGiftCard ||
				product.tags.includes('CustomShape') ||
				(isCustomShape ? true : index === openOption)
			}
			setOpenOption={() => setOpenOption(isCustomShape ? 0 : index)}
			product
			display
			showHelp={
				!isCustomShape &&
				(option.name.toLowerCase() === 'ring size' || option.name === 'carat')
			}
			helpLink={
				!isCustomShape &&
				(option.name.toLowerCase() === 'ring size' || option.name === 'carat')
					? isMobile
						? '/Size-Guide-Difinery-Mobile.pdf'
						: '/Size-Guide-Difinery-Desktop.pdf'
					: undefined
			}
		>
			<div className={styles.variantButtonsContainer}>
				{isCustomShape ? (
					// Custom Shape buttons
					customShapes
						.filter(
							shape =>
								!(
									product.title.toLowerCase().includes('promise') &&
									shape.title.toLowerCase() === 'heart'
								)
						)
						.map(shape => (
							<button
								key={shape.title}
								onClick={() => {
									// Find current shape in product title
									const currentShape = customShapes.find(s =>
										product.title.toLowerCase().includes(s.title.toLowerCase())
									)

									if (currentShape && typeof window !== 'undefined') {
										// Get current pathname
										const currentPath = window.location.pathname

										// Replace the current shape with the new shape in the URL
										const newPath = currentPath.replace(
											new RegExp(currentShape.title.toLowerCase(), 'i'),
											shape.title.toLowerCase()
										)

										// Navigate to the new URL with existing query params
										window.location.href = newPath + window.location.search
									}
								}}
							>
								<Image
									src={shape.path}
									width={
										isMobile
											? (32 * shape.width) / shape.height
											: (48 * shape.width) / shape.height
									}
									height={isMobile ? 32 : 48}
									alt={`${shape.title} Diamond Shape`}
									style={{
										opacity: product.title
											.toLowerCase()
											.includes(shape.title.toLowerCase())
											? 1
											: 0.25
									}}
								/>
							</button>
						))
				) : isGiftCard ? (
					// Gift Card Input
					<GiftCardInput
						options={option.optionValues}
						selectedValue={selectedOptions[option.name] || null}
						onSelect={value => handleOptionSelection(option.name, value, index)}
						onDisplayUpdate={value => handleDisplayUpdate(option.name, value)}
					/>
				) : (
					// Standard Product Options
					option.optionValues.map(value => (
						<button
							key={value.name}
							onClick={() =>
								handleOptionSelection(option.name, value.name, index)
							}
							style={{
								fontWeight:
									selectedOptions[option.name] === value.name
										? 'bold'
										: 'normal'
							}}
						>
							{option.name.toLowerCase() === 'metal' && (
								<Image
									src={`/${returnMetalType(value.name)}`}
									width={32}
									height={32}
									alt={`${value.name} ${option.name}`}
								/>
							)}

							{option.name.toLowerCase() === 'diamond shape' && (
								<Image
									src={`/${returnDiamondShape(value.name)}`}
									width={32}
									height={32}
									alt={`${value.name} ${option.name}`}
								/>
							)}
							{value.name}
						</button>
					))
				)}
			</div>

			{!isCustomShape && option.name.toLowerCase() === 'total carat weight' && (
				<Typography variant='p' fontStyle='italic' fontSize='10px' mt={'1rem'}>
					*All images are represented in 2.00 carat weight.
				</Typography>
			)}
		</Accordion>
	)
}

export default ProductOptionAccordion
