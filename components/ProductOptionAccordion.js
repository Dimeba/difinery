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
import { useState, useEffect } from 'react'

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
	extraTitleText = null,
	// For stackable rings image filtering
	setSelectedColor = null
}) => {
	const isStackableRings = product.tags.includes('Stackable Rings')
	const isMetalOption = option?.name?.toLowerCase() === 'metal'

	// State for stackable ring color selections
	const [stackableColors, setStackableColors] = useState([])

	// Parse the metal option value to determine number of rings
	const parseMetalColors = metalValue => {
		if (!metalValue) return []
		const colors = []
		const value = metalValue.toLowerCase()

		// Count occurrences of each color (check for various naming conventions)
		const whiteMatches = (value.match(/white/g) || []).length
		const yellowMatches = (value.match(/yellow/g) || []).length
		const roseMatches =
			(value.match(/rose/g) || []).length + (value.match(/pink/g) || []).length

		// Build array with the colors
		for (let i = 0; i < whiteMatches; i++) colors.push('White')
		for (let i = 0; i < yellowMatches; i++) colors.push('Yellow')
		for (let i = 0; i < roseMatches; i++) colors.push('Rose')

		return colors
	}

	// Get unique color options (White, Yellow, Rose) from actual variants
	const getStackableColorOptions = () => {
		const colorSet = new Set()
		if (option?.optionValues) {
			option.optionValues.forEach(value => {
				const colors = parseMetalColors(value.name)
				colors.forEach(color => colorSet.add(color))
			})
		}
		// Sort in specific order: Yellow, White, Rose
		const colorOrder = { 'Yellow': 1, 'White': 2, 'Rose': 3 }
		return Array.from(colorSet).sort((a, b) => colorOrder[a] - colorOrder[b])
	}

	// Get maximum number of rings available based on variants
	const getMaxRings = () => {
		let maxRings = 1
		option.optionValues.forEach(value => {
			const colors = parseMetalColors(value.name)
			maxRings = Math.max(maxRings, colors.length)
		})
		return maxRings
	}

	// Check if two color arrays match (order-independent for mirrored variants)
	const colorsMatch = (colors1, colors2) => {
		if (colors1.length !== colors2.length) return false

		// First try exact order match
		const exactMatch = colors1.every((c, i) => c === colors2[i])
		if (exactMatch) return true

		// Then try reversed order for 2-ring combinations only
		if (colors1.length === 2) {
			const reversed = [...colors2].reverse()
			return colors1.every((c, i) => c === reversed[i])
		}

		return false
	}

	// Initialize stackable colors automatically on mount
	useEffect(() => {
		if (
			isStackableRings &&
			isMetalOption &&
			option?.optionValues &&
			stackableColors.length === 0
		) {
			// Always initialize with max number of rings available
			const maxRings = getMaxRings()
			const availableColors = getStackableColorOptions()

			console.log('Init with maxRings:', maxRings)
			// Default to Yellow (first in order), or first available color
			const defaultColor = availableColors.includes('Yellow')
				? 'Yellow'
				: availableColors[0] || 'White'
			const initialColors = new Array(maxRings).fill(defaultColor)
			setStackableColors(initialColors)
		}
	}, [isStackableRings, isMetalOption])

	// Handle individual ring color selection for stackable rings
	const handleStackableColorChange = (ringIndex, color) => {
		const newColors = [...stackableColors]
		newColors[ringIndex] = color
		setStackableColors(newColors)

		console.log('Selected colors:', newColors)

		// Find matching variant based on selected colors (handle mirrored order)
		const matchingValue = option.optionValues.find(value => {
			const valueColors = parseMetalColors(value.name)
			console.log('Checking variant:', value.name, 'colors:', valueColors)
			// Check if colors match (order-independent)
			return colorsMatch(valueColors, newColors)
		})

		console.log('Matching variant:', matchingValue?.name)

		// Update image filter based on stackable color codes FIRST
		const colorCodes = newColors.map(c => c[0].toUpperCase()).join('')
		console.log('Setting selectedColor to:', `Stackable-${colorCodes}`)
		if (colorCodes && setSelectedColor) {
			// Create a special color string for image filtering
			setSelectedColor(`Stackable-${colorCodes}`)
		}

		if (matchingValue) {
			// Advance to next accordion after selection
			console.log('Calling handleOptionSelection with:', matchingValue.name)
			handleOptionSelection(option.name, matchingValue.name, index)
		} else {
			console.warn('No matching variant found for:', newColors)
		}
	}

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
				) : isStackableRings && isMetalOption ? (
					// Stackable Rings - Select color for each ring in rows
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '1rem',
							width: '100%'
						}}
					>
						{console.log('Rendering stackableColors:', stackableColors)}
						{stackableColors.length > 0 ? (
							stackableColors.map((selectedColor, ringIndex) => (
								<div
									key={ringIndex}
									style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
								>
									<Typography
										variant='p'
										fontWeight='bold'
										fontSize='12px'
										style={{ minWidth: '60px' }}
									>
										Ring {ringIndex + 1}
									</Typography>
									<div
										style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
									>
										{getStackableColorOptions().map(color => (
											<button
												key={color}
												onClick={() =>
													handleStackableColorChange(ringIndex, color)
												}
												style={{
													borderRadius: '50%',
													border:
														selectedColor === color ? '1px solid black' : '',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center'
													// opacity: selectedColor === color ? 1 : 0.6
												}}
											>
												<Image
													src={`/${returnMetalType(color)}`}
													width={24}
													height={24}
													alt={`${color} Gold`}
												/>
											</button>
										))}
									</div>
								</div>
							))
						) : (
							<div>Loading...</div>
						)}
					</div>
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
