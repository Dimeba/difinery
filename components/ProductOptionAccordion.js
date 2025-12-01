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
import { useState, useEffect, useMemo } from 'react'

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

	// Parse the metal option value to determine colors in order
	const parseMetalColors = metalValue => {
		if (!metalValue) return []
		const value = metalValue.toLowerCase()
		const colors = []

		// Handle both "Yellow & White" and "Yellow/White/Yellow" formats
		// Split by both spaces and slashes to get individual color tokens
		const tokens = value.split(/[\s/]+/)

		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i]
			if (token.includes('white')) {
				colors.push('White')
			} else if (token.includes('yellow')) {
				colors.push('Yellow')
			} else if (token.includes('rose') || token.includes('pink')) {
				colors.push('Rose')
			}
		}

		return colors
	}

	// Get unique color options (White, Yellow, Rose) from actual variants
	const getStackableColorOptions = useMemo(() => {
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
	}, [option?.optionValues])

	// Get maximum number of rings available based on variants
	const getMaxRings = useMemo(() => {
		let maxRings = 1
		if (option?.optionValues) {
			option.optionValues.forEach(value => {
				const colors = parseMetalColors(value.name)
				maxRings = Math.max(maxRings, colors.length)
			})
		}
		return maxRings
	}, [option?.optionValues])

	// Check if two color arrays match (prioritize exact order, then try reversed)
	const colorsMatch = (colors1, colors2) => {
		if (colors1.length !== colors2.length) return false

		// ALWAYS try exact order match first (RY should match RY before trying YR)
		const exactMatch = colors1.every((c, i) => c === colors2[i])
		if (exactMatch) return true

		// Only try reversed order if no exact match found
		// This ensures user selection order (Ring 1 -> Last Ring) is prioritized
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
			// Default to Yellow (first in order), or first available color
			const defaultColor = getStackableColorOptions.includes('Yellow')
				? 'Yellow'
				: getStackableColorOptions[0] || 'White'
			const initialColors = new Array(getMaxRings).fill(defaultColor)
			setStackableColors(initialColors)
		}
	}, [
		isStackableRings,
		isMetalOption,
		getMaxRings,
		getStackableColorOptions,
		stackableColors.length
	])

	// Handle individual ring color selection for stackable rings
	const handleStackableColorChange = (ringIndex, color) => {
		// Update the color for the selected ring
		const newColors = [...stackableColors]
		newColors[ringIndex] = color
		setStackableColors(newColors)

		console.log('User selected 3 rings:', newColors)

		// Try to find exact match first (user's ring order)
		let matchingValue = option.optionValues.find(value => {
			const valueColors = parseMetalColors(value.name)
			console.log('Checking variant:', value.name, '-> parsed:', valueColors)
			return (
				valueColors.length === newColors.length &&
				valueColors.every((c, i) => c === newColors[i])
			)
		})

		console.log('Exact match:', matchingValue?.name)

		// If no exact match, try other permutations
		if (!matchingValue) {
			// For 2 rings, just try reversed
			if (newColors.length === 2) {
				const flippedColors = [...newColors].reverse()
				matchingValue = option.optionValues.find(value => {
					const valueColors = parseMetalColors(value.name)
					return (
						valueColors.length === flippedColors.length &&
						valueColors.every((c, i) => c === flippedColors[i])
					)
				})
			} else {
				// For 3+ rings, check if any permutation matches
				console.log('Trying permutation match for 3+ rings')
				matchingValue = option.optionValues.find(value => {
					const valueColors = parseMetalColors(value.name)
					if (valueColors.length !== newColors.length) return false

					// Check if arrays contain same colors (order-independent)
					const sortedUser = [...newColors].sort()
					const sortedVariant = [...valueColors].sort()
					const matches = sortedUser.every((c, i) => c === sortedVariant[i])
					console.log(
						'Permutation check:',
						value.name,
						sortedUser,
						'vs',
						sortedVariant,
						'-> matches:',
						matches
					)
					return matches
				})
			}
		}

		console.log('Final matched variant:', matchingValue?.name)

		// Use the matched variant's color order for images (images are named after variants)
		if (matchingValue) {
			const variantColors = parseMetalColors(matchingValue.name)
			const colorCodes = variantColors.map(c => c[0].toUpperCase()).join('')
			console.log('Setting image filter to:', `Stackable-${colorCodes}`)
			setSelectedColor(`Stackable-${colorCodes}`)
			handleOptionSelection(option.name, matchingValue.name, index)
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
										{getStackableColorOptions.map(color => (
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
