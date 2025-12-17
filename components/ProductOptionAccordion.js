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

// data
import customShapes from '@/data/shapes.json' with { type: 'json' }

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
	// Stackable option props
	isStackableOption = false,
	extraTitleText = null,
	// For stackable rings image filtering
	setSelectedColor = null
}) => {
	const isStackableRings = product.tags.includes('Stackable Rings')
	const isMetalOption = option?.name?.toLowerCase() === 'metal'
	const isSingleStackable =
		(product.handle || '').toLowerCase().includes('single') ||
		(product.title || '').toLowerCase().includes('single')

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

	// Initialize stackable colors automatically on mount
	useEffect(() => {
		if (
			isStackableRings &&
			!isSingleStackable &&
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
		isSingleStackable,
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

		// Try to find exact match first (user's ring order)
		let matchingValue = option.optionValues.find(value => {
			const valueColors = parseMetalColors(value.name)
			return (
				valueColors.length === newColors.length &&
				valueColors.every((c, i) => c === newColors[i])
			)
		})

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
				matchingValue = option.optionValues.find(value => {
					const valueColors = parseMetalColors(value.name)
					if (valueColors.length !== newColors.length) return false

					// Check if arrays contain same colors (order-independent)
					const sortedUser = [...newColors].sort()
					const sortedVariant = [...valueColors].sort()
					const matches = sortedUser.every((c, i) => c === sortedVariant[i])
					return matches
				})
			}
		}

		// Use the matched variant's color order for images (images are named after variants)
		if (matchingValue) {
			const variantColors = parseMetalColors(matchingValue.name)
			const colorCodes = variantColors.map(c => c[0].toUpperCase()).join('')
			setSelectedColor(`Stackable-${colorCodes}`)
			handleOptionSelection(option.name, matchingValue.name, null)
		}
	}

	const productCollection = useMemo(() => {
		const edges = product?.collections?.edges || []
		return edges.filter(
			collection =>
				collection.node.title !== 'Rings' &&
				collection.node.title !== 'Necklaces' &&
				collection.node.title !== 'Earrings' &&
				collection.node.title !== 'Bracelets'
		)[0]?.node
	}, [product?.collections?.edges])

	const relatedColectionProducts = useMemo(() => {
		const edges = productCollection?.products?.edges || []
		return edges.map(edge => edge.node)
	}, [productCollection])

	// related shapes

	const relatedShapes = useMemo(() => {
		return relatedColectionProducts
			.filter(product => product.tags.includes('CustomShape'))
			.map(p => p.handle)
	}, [relatedColectionProducts])

	const availableShapes = useMemo(() => {
		return customShapes.filter(shape =>
			relatedShapes.some(handle =>
				handle.toLowerCase().includes(shape.title.toLowerCase())
			)
		)
	}, [customShapes, relatedShapes])

	// related stacks
	const relatedStacks = useMemo(() => {
		return relatedColectionProducts
			.filter(product => product.tags.includes('Stackable Rings'))
			.map(p => ({
				title: p.title,
				handle: p.handle,
				// Fallback label when title is missing
				name: p.title ||
					p.handle
						.split('-')
						.map(word => word.charAt(0).toUpperCase() + word.slice(1))
						.join(' ')
			}))
	}, [relatedColectionProducts])	

	return (
		<Accordion
			key={option?.name || (isCustomShape ? 'custom-shape' : 'stackable-option')}
			title={
				isCustomShape
					? 'Diamond Shape'
					: isStackableOption
					? 'Stackable'
					: option.name
			}
			extraTitleText={
				isCustomShape || isStackableOption
					? extraTitleText
					: selectedOptions[option?.name]
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
				(isCustomShape || isStackableOption ? true : index === openOption)
			}
			setOpenOption={() => setOpenOption(isCustomShape || isStackableOption ? 0 : index)}
			product
			display
			showHelp={
				!isCustomShape &&
				!isStackableOption &&
				option?.name &&
				(option.name.toLowerCase() === 'ring size' || option.name === 'carat')
			}
			helpLink={
				!isCustomShape &&
				!isStackableOption &&
				option?.name &&
				(option.name.toLowerCase() === 'ring size' || option.name === 'carat')
					? isMobile
						? '/Size-Guide-Difinery-Mobile.pdf'
						: '/Size-Guide-Difinery-Desktop.pdf'
					: undefined
			}
		>
			<div className={styles.variantButtonsContainer}>
				{isStackableOption ? (
					// Stackable rings options
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'stretch',
							gap: '1rem',
							width: '100%'
						}}
					>
						{relatedStacks.map(stack => {
							const isSelected = !!stack.title && stack.title === product.title
							return (
								<button
									key={stack.handle}
									onClick={() => {
										if (!isSelected && typeof window !== 'undefined') {
											// Navigate to the selected stackable product
											const currentPath = window.location.pathname
											const basePath = currentPath.split('/').slice(0, -1).join('/')
											window.location.href = `${basePath}/${stack.handle}${window.location.search}`
										}
									}}
									style={{
										display: 'flex',
										justifyContent: 'flex-start',
										width: '100%',
										textAlign: 'left',
										padding: 0,
										margin: 0,
										fontWeight: isSelected ? 'bold' : 'normal',
										opacity: isSelected ? 1 : 0.7
									}}
								>
									{stack.title || stack.name}
								</button>
							)
						})}
					</div>
				) : isCustomShape ? (
					// Custom Shape buttons
					availableShapes
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
									width={(32 * shape.width) / shape.height}
									height={32}
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
				) : isStackableRings && isMetalOption && !isSingleStackable ? (
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
										fontWeight='500'
										fontSize='12px'
										style={{ minWidth: '90px' }}
										color='#9b9b9b'
									>
										{ringIndex + 1 === 1
											? 'First Ring'
											: ringIndex + 1 === 2
											? 'Second Ring'
											: ringIndex + 1 === 3
											? 'Third Ring'
											: `Ring ${ringIndex + 1}`}
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
														selectedColor === color ? '1px solid #9b9b9b' : '',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													padding: '2px',
													opacity: selectedColor === color ? 1 : 0.6
												}}
											>
												<Image
													src={`/${returnMetalType(color)}`}
													width={20}
													height={20}
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
									width={24}
									height={24}
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

			{!isCustomShape && !isStackableOption && option?.name?.toLowerCase() === 'total carat weight' && (
				<Typography variant='p' fontStyle='italic' fontSize='10px' mt={'1rem'}>
					*All images are represented in 2.00 carat weight.
				</Typography>
			)}
		</Accordion>
	)
}

export default ProductOptionAccordion
