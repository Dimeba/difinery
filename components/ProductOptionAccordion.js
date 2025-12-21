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
	extraTitleText = null,
	// For stackable rings image filtering
	setSelectedColor = null
}) => {
	const isStackableRings = product?.tags?.includes('Stackable Rings')
	const isMetalOption = option?.name?.toLowerCase() === 'metal'
	const isSingleStackable =
		(product.handle || '').toLowerCase().includes('single') ||
		(product.title || '').toLowerCase().includes('single')
	const isSideDiamond = !!product?.tags?.includes('SideDiamond')

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
	const currentMaxRings = useMemo(() => {
		let maxRings = 1
		if (option?.optionValues) {
			option.optionValues.forEach(value => {
				const colors = parseMetalColors(value.name)
				maxRings = Math.max(maxRings, colors.length)
			})
		}
		return Math.min(3, maxRings)
	}, [option?.optionValues])

	const stackableProductsInCollection = useMemo(() => {
		return relatedColectionProducts.filter(p => p?.tags?.includes('Stackable Rings'))
	}, [relatedColectionProducts])

	const collectionMaxRings = useMemo(() => {
		let maxRings = currentMaxRings || 1
		stackableProductsInCollection.forEach(p => {
			const metal = (p?.options || []).find(
				o => (o?.name || '').toLowerCase() === 'metal'
			)
			const values = metal?.optionValues || []
			values.forEach(v => {
				maxRings = Math.max(maxRings, parseMetalColors(v?.name).length)
			})
		})
		return Math.min(3, Math.max(1, maxRings))
	}, [stackableProductsInCollection, currentMaxRings])

	const activeRingPositions = useMemo(() => {
		if (!isStackableRings || !isMetalOption) return null
		if (currentMaxRings >= 3) return [0, 1, 2]
		if (currentMaxRings === 2) {
			// Only use the "third" slot if the collection supports 3-ring configs.
			return isSideDiamond && collectionMaxRings >= 3 ? [0, 2] : [0, 1]
		}
		return isSideDiamond ? [0] : [1]
	}, [
		isStackableRings,
		isMetalOption,
		currentMaxRings,
		isSideDiamond,
		collectionMaxRings
	])

	const stackableStorageKey = useMemo(() => {
		const collectionHandle = productCollection?.handle || 'unknown'
		return `stackableColors:${collectionHandle}`
	}, [productCollection?.handle])

	const defaultStackableColor = useMemo(() => {
		return getStackableColorOptions.includes('Yellow')
			? 'Yellow'
			: getStackableColorOptions[0] || 'White'
	}, [getStackableColorOptions])

	const readStoredStackableColors = () => {
		if (typeof window === 'undefined') return null
		try {
			const raw = window.sessionStorage.getItem(stackableStorageKey)
			if (!raw) return null
			const parsed = JSON.parse(raw)
			if (!Array.isArray(parsed?.colors)) return null
			return parsed.colors
		} catch {
			return null
		}
	}

	const writeStoredStackableColors = colors => {
		if (typeof window === 'undefined') return
		try {
			window.sessionStorage.setItem(
				stackableStorageKey,
				JSON.stringify({ colors, ts: Date.now() })
			)
		} catch {
			// ignore
		}
	}

	const applyColorsToThisProduct = colorsByPosition => {
		if (!option?.optionValues || !activeRingPositions) return
		const desired = activeRingPositions.map(pos => colorsByPosition[pos]).filter(Boolean)
		if (desired.length !== activeRingPositions.length) return

		let matchingValue = option.optionValues.find(value => {
			const valueColors = parseMetalColors(value.name)
			return (
				valueColors.length === desired.length &&
				valueColors.every((c, i) => c === desired[i])
			)
		})

		if (!matchingValue && desired.length === 2) {
			const flipped = [...desired].reverse()
			matchingValue = option.optionValues.find(value => {
				const valueColors = parseMetalColors(value.name)
				return (
					valueColors.length === flipped.length &&
					valueColors.every((c, i) => c === flipped[i])
				)
			})
		}

		if (!matchingValue && desired.length >= 3) {
			matchingValue = option.optionValues.find(value => {
				const valueColors = parseMetalColors(value.name)
				if (valueColors.length !== desired.length) return false
				const sortedUser = [...desired].sort()
				const sortedVariant = [...valueColors].sort()
				return sortedUser.every((c, i) => c === sortedVariant[i])
			})
		}

		if (matchingValue) {
			const variantColors = parseMetalColors(matchingValue.name)
			const colorCodes = variantColors.map(c => c[0].toUpperCase()).join('')
			setSelectedColor && setSelectedColor(`Stackable-${colorCodes}`)
			handleOptionSelection && handleOptionSelection(option.name, matchingValue.name, null)
		}
	}

	const getProductRingCount = p => {
		const metal = (p?.options || []).find(o => (o?.name || '').toLowerCase() === 'metal')
		const values = metal?.optionValues || []
		let max = 1
		values.forEach(v => {
			max = Math.max(max, parseMetalColors(v?.name).length)
		})
		return max
	}

	const findTargetHandle = (targetRings, targetSideDiamond) => {
		const candidates = [product, ...stackableProductsInCollection]
		let list = candidates.filter(p => getProductRingCount(p) === targetRings)
		if ((targetRings === 1 || targetRings === 2) && typeof targetSideDiamond === 'boolean') {
			const filtered = list.filter(p => (p?.tags || []).includes('SideDiamond') === targetSideDiamond)
			if (filtered.length) list = filtered
		}
		return list[0]?.handle || null
	}

	const navigateToHandle = handle => {
		if (typeof window === 'undefined') return
		const currentPath = window.location.pathname
		const basePath = currentPath.split('/').slice(0, -1).join('/')
		window.location.href = `${basePath}/${handle}${window.location.search}`
	}

	// Initialize stackable colors (from saved selection, current metal, or defaults)
	useEffect(() => {
		if (!isStackableRings || !isMetalOption) return
		if (!option?.optionValues || !activeRingPositions) return
		if (stackableColors.length) return

		const stored = readStoredStackableColors()
		const base = new Array(collectionMaxRings).fill(null)

		if (Array.isArray(stored) && stored.length) {
			for (let i = 0; i < Math.min(collectionMaxRings, stored.length); i++) {
				base[i] = stored[i] || null
			}
		} else {
			const initialMetal =
				selectedOptions?.[option.name] ||
				product?.variants?.edges?.[0]?.node?.selectedOptions?.find(
					so => so?.name === 'Metal'
				)?.value ||
				null
			const colors = parseMetalColors(initialMetal)
			activeRingPositions.forEach((pos, i) => {
				base[pos] = colors[i] || defaultStackableColor
			})
		}

		setStackableColors(base)
		// If we restored a full selection for this product's active rings, apply it.
		applyColorsToThisProduct(base)
	}, [
		isStackableRings,
		isMetalOption,
		option?.optionValues,
		activeRingPositions,
		collectionMaxRings,
		defaultStackableColor,
		stackableColors.length
	])

	// Handle individual ring color selection for stackable rings
	const handleStackableColorChange = (ringIndex, color) => {
		const next = [...stackableColors]
		// Toggle: click same color again to deselect that ring
		next[ringIndex] = next[ringIndex] === color ? null : color

		// Enforce "first" ring exists when selecting "third" (required by 1/2/3 ring products)
		if (next[2] && !next[0]) {
			next[0] = next[1] || defaultStackableColor
		}

		setStackableColors(next)
		writeStoredStackableColors(next)

		const hasFirst = !!next[0]
		const hasSecond = !!next[1]
		const hasThird = !!next[2]

		let targetRings = null
		let targetSideDiamond = null

		if (hasFirst && hasSecond && hasThird) {
			targetRings = 3
		} else if (hasFirst && !hasSecond && hasThird) {
			targetRings = 2
			targetSideDiamond = true
		} else if (hasFirst && hasSecond && !hasThird) {
			targetRings = 2
			targetSideDiamond = false
		} else if (hasFirst && !hasSecond && !hasThird) {
			targetRings = 1
			targetSideDiamond = true
		} else if (!hasFirst && hasSecond && !hasThird) {
			targetRings = 1
			targetSideDiamond = false
		}

		if (!targetRings) return
		if (targetRings > collectionMaxRings) return

		const targetHandle = findTargetHandle(targetRings, targetSideDiamond)
		if (targetHandle && targetHandle !== product?.handle) {
			return navigateToHandle(targetHandle)
		}

		// Same product: apply selection to metal variant + images
		applyColorsToThisProduct(next)
	}

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
	}, [relatedShapes])



	return (
		<Accordion
			key={option?.name || (isCustomShape ? 'custom-shape' : 'option')}
			title={
				isCustomShape
					? 'Diamond Shape'
					: option?.name
			}
			extraTitleText={
				isCustomShape
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
				product.tags.includes('Stackable Rings') ||
				(isCustomShape ? true : index === openOption)
			}
			setOpenOption={() =>
				setOpenOption(
					isCustomShape ||
						product.tags.includes('CustomShape') ||
						product.tags.includes('Stackable Rings')
						? 0
						: index
				)
			}
			product
			display
			showHelp={
				!isCustomShape &&
				option?.name &&
				(option.name.toLowerCase() === 'ring size' || option.name === 'carat')
			}
			helpLink={
				!isCustomShape &&
				option?.name &&
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
									src={product.title
											.toLowerCase()
											.includes(shape.title.toLowerCase()) ? shape.path : shape.pathBase}
									width={isMobile ? (24 * shape.width) / shape.height : (32 * shape.width) / shape.height}
									height={isMobile ? 24 : 32}
									alt={`${shape.title} Diamond Shape`}
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
							<p style={{color: "#9b9b9b", fontSize: "12px" }}>Loading...</p>
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
					option?.name?.toLowerCase() === 'metal' ? (
						<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
							{option.optionValues.map(value => {
								const isSelected = selectedOptions[option.name] === value.name
								return (
									<button
										key={value.name}
										onClick={() =>
											handleOptionSelection(option.name, value.name, index)
										}
										style={{
											borderRadius: '50%',
											border: isSelected ? '1px solid #9b9b9b' : '',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											padding: '2px',
											margin: 0,
											opacity: isSelected ? 1 : 0.6
										}}
									>
										<Image
											src={`/${returnMetalType(value.name)}`}
											width={20}
											height={20}
											alt={`${value.name} ${option.name}`}
										/>
									</button>
								)
							})}
						</div>
					) : (
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
					)
				)}
			</div>

			{!isCustomShape && option?.name?.toLowerCase() === 'total carat weight' && (
				<Typography variant='p' fontStyle='italic' fontSize='10px' mt={'1rem'}>
					*All images are represented in 2.00 carat weight.
				</Typography>
			)}
		</Accordion>
	)
}

export default ProductOptionAccordion
