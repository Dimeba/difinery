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
import { useState, useEffect, useMemo, useCallback } from 'react'

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
	
	// Check if this is a Size option for Rings/Necklaces/Bracelets
	const isSizeCategory = product?.category?.name && 
		['Rings', 'Necklaces', 'Bracelets'].includes(product.category.name)
	const isSizeOption = option?.name && option.name.toLowerCase().includes('size')
	const shouldKeepSizeOpen = isSizeCategory && isSizeOption

	const collectionHandleFromUrl = useMemo(() => {
		if (typeof window === 'undefined') return null
		try {
			const params = new URLSearchParams(window.location.search)
			return params.get('collection')
		} catch {
			return null
		}
	}, [])

	const goldFromUrl = useMemo(() => {
		if (typeof window === 'undefined') return null
		try {
			const params = new URLSearchParams(window.location.search)
			return params.get('gold')
		} catch {
			return null
		}
	}, [])

	const normalizedGoldFromUrl = useMemo(() => {
		const raw = (goldFromUrl || '').toLowerCase().trim()
		if (!raw) return null
		if (raw.includes('yellow')) return 'Yellow'
		if (raw.includes('white')) return 'White'
		if (raw.includes('rose') || raw.includes('pink')) return 'Rose'
		return null
	}, [goldFromUrl])

	const isSingleGoldParam = useMemo(() => {
		const raw = (goldFromUrl || '').toLowerCase()
		if (!raw) return false
		// treat "yellow-and-white" (multi) as not a single-color override
		return !raw.includes('and')
	}, [goldFromUrl])

	const productCollection = useMemo(() => {
		const edges = product?.collections?.edges || []
		if (collectionHandleFromUrl) {
			const match = edges.find(e => e?.node?.handle === collectionHandleFromUrl)
			if (match?.node) return match.node
		}
		return edges.filter(
			collection =>
				collection.node.title !== 'Rings' &&
				collection.node.title !== 'Necklaces' &&
				collection.node.title !== 'Earrings' &&
				collection.node.title !== 'Bracelets'
		)[0]?.node
	}, [product?.collections?.edges, collectionHandleFromUrl])

	const relatedColectionProducts = useMemo(() => {
		const edges = productCollection?.products?.edges || []
		return edges.map(edge => edge.node)
	}, [productCollection?.products?.edges])

	// State for stackable ring color selections
	const [stackableColors, setStackableColors] = useState([])

	// Parse the metal option value to determine colors in order
	const parseMetalColors = useCallback(metalValue => {
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
	}, [])

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
	}, [option?.optionValues, parseMetalColors])

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
	}, [option?.optionValues, parseMetalColors])

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
		// Fallback: if related products don't include options (or options are empty),
		// infer at least 2/3 by how many stackable products are present.
		if (maxRings <= 1) {
			const count = stackableProductsInCollection.length
			if (count >= 3) maxRings = 3
			else if (count >= 2) maxRings = 2
		}
		return Math.min(3, Math.max(1, maxRings))
	}, [stackableProductsInCollection, currentMaxRings, parseMetalColors])

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
		const collectionHandle = collectionHandleFromUrl || productCollection?.handle || 'unknown'
		return `stackableColors:${collectionHandle}`
	}, [collectionHandleFromUrl, productCollection?.handle])

	const stackablePendingKey = useMemo(() => {
		const collectionHandle = collectionHandleFromUrl || productCollection?.handle || 'unknown'
		return `stackablePending:${collectionHandle}`
	}, [collectionHandleFromUrl, productCollection?.handle])

	const defaultStackableColor = useMemo(() => {
		return getStackableColorOptions.includes('Yellow')
			? 'Yellow'
			: getStackableColorOptions[0] || 'White'
	}, [getStackableColorOptions])

	const readStoredStackableColors = useCallback(() => {
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
	}, [stackableStorageKey])

	const readPendingStackable = useCallback(() => {
		if (typeof window === 'undefined') return null
		try {
			const raw = window.sessionStorage.getItem(stackablePendingKey)
			if (!raw) return null
			const parsed = JSON.parse(raw)
			if (!parsed || typeof parsed !== 'object') return null
			return parsed
		} catch {
			return null
		}
	}, [stackablePendingKey])

	const writePendingStackable = useCallback(pending => {
		if (typeof window === 'undefined') return
		try {
			window.sessionStorage.setItem(
				stackablePendingKey,
				JSON.stringify({ ...pending, ts: Date.now() })
			)
		} catch {
			// ignore
		}
	}, [stackablePendingKey])

	const clearPendingStackable = useCallback(() => {
		if (typeof window === 'undefined') return
		try {
			window.sessionStorage.removeItem(stackablePendingKey)
		} catch {
			// ignore
		}
	}, [stackablePendingKey])

	const writeStoredStackableColors = useCallback(colors => {
		if (typeof window === 'undefined') return
		try {
			window.sessionStorage.setItem(
				stackableStorageKey,
				JSON.stringify({ colors, ts: Date.now() })
			)
		} catch {
			// ignore
		}
	}, [stackableStorageKey])

	// Keep UI state as-is, but normalize for routing/variant logic.
	// - only Third => treat as only First
	// - Second + Third => treat as First + Second
	const normalizeStackableForLogic = useCallback(colors => {
		const next = Array.isArray(colors) ? [...colors] : []
		if (!next.length) return next

		if (!next[0] && !next[1] && next[2]) {
			next[0] = next[2]
			next[2] = null
		} else if (!next[0] && next[1] && next[2]) {
			next[0] = next[1]
			next[1] = next[2]
			next[2] = null
		}

		// Enforce "first" exists when "third" is set (logic-only; UI can still show only Third)
		if (next[2] && !next[0]) {
			next[0] = next[1] || defaultStackableColor
		}

		return next
	}, [defaultStackableColor])

	const applyColorsToThisProduct = useCallback(colorsByPosition => {
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
			// Single-ring stackables don't have Stackable-* images; use the Metal value string.
			if (setSelectedColor) {
				if (variantColors.length <= 1) {
					setSelectedColor(matchingValue.name)
				} else {
					setSelectedColor(`Stackable-${colorCodes}`)
				}
			}
			// Important: don't "re-select" the same value, because ProductOptionsUI
			// treats clicking the same option again as a reset.
			if (handleOptionSelection && selectedOptions?.[option.name] !== matchingValue.name) {
				handleOptionSelection(option.name, matchingValue.name, null)
			}
		}
	}, [
		activeRingPositions,
		handleOptionSelection,
		option?.name,
		option?.optionValues,
		parseMetalColors,
		selectedOptions,
		setSelectedColor
	])

	const getProductRingCount = p => {
		const metal = (p?.options || []).find(o => (o?.name || '').toLowerCase() === 'metal')
		const values = metal?.optionValues || []
		let max = 1
		values.forEach(v => {
			max = Math.max(max, parseMetalColors(v?.name).length)
		})
		return max
	}

	const getProductMetalOptionValues = p => {
		const metal = (p?.options || []).find(o => (o?.name || '').toLowerCase() === 'metal')
		return metal?.optionValues || []
	}

	const findMatchingMetalValueName = (p, desiredColors) => {
		const optionValues = getProductMetalOptionValues(p)
		if (!optionValues.length) return null
		if (!desiredColors || desiredColors.some(c => !c)) return null

		let match = optionValues.find(v => {
			const valueColors = parseMetalColors(v?.name)
			return (
				valueColors.length === desiredColors.length &&
				valueColors.every((c, i) => c === desiredColors[i])
			)
		})
		if (match?.name) return match.name

		if (desiredColors.length === 2) {
			const flipped = [...desiredColors].reverse()
			match = optionValues.find(v => {
				const valueColors = parseMetalColors(v?.name)
				return (
					valueColors.length === flipped.length &&
					valueColors.every((c, i) => c === flipped[i])
				)
			})
			if (match?.name) return match.name
		}

		if (desiredColors.length >= 3) {
			match = optionValues.find(v => {
				const valueColors = parseMetalColors(v?.name)
				if (valueColors.length !== desiredColors.length) return false
				const sortedUser = [...desiredColors].sort()
				const sortedVariant = [...valueColors].sort()
				return sortedUser.every((c, i) => c === sortedVariant[i])
			})
			if (match?.name) return match.name
		}

		return null
	}

	const productHasMatchingMetalVariant = (p, desiredColors) => {
		const optionValues = getProductMetalOptionValues(p)
		if (!optionValues.length) return false
		if (!desiredColors || desiredColors.some(c => !c)) return false

		const matchesExact = optionValues.some(v => {
			const valueColors = parseMetalColors(v?.name)
			return (
				valueColors.length === desiredColors.length &&
				valueColors.every((c, i) => c === desiredColors[i])
			)
		})
		if (matchesExact) return true

		if (desiredColors.length === 2) {
			const flipped = [...desiredColors].reverse()
			return optionValues.some(v => {
				const valueColors = parseMetalColors(v?.name)
				return (
					valueColors.length === flipped.length &&
					valueColors.every((c, i) => c === flipped[i])
				)
			})
		}

		// 3+ rings: allow order-independent match
		return optionValues.some(v => {
			const valueColors = parseMetalColors(v?.name)
			if (valueColors.length !== desiredColors.length) return false
			const sortedUser = [...desiredColors].sort()
			const sortedVariant = [...valueColors].sort()
			return sortedUser.every((c, i) => c === sortedVariant[i])
		})
	}

	const findTargetHandle = (targetRings, targetSideDiamond, desiredColorsForTarget) => {
		const candidates = [product, ...stackableProductsInCollection]
		let list = candidates.filter(p => getProductRingCount(p) === targetRings)
		if ((targetRings === 1 || targetRings === 2) && typeof targetSideDiamond === 'boolean') {
			const filtered = list.filter(p => (p?.tags || []).includes('SideDiamond') === targetSideDiamond)
			if (filtered.length) list = filtered
		}
		if (desiredColorsForTarget?.length) {
			const withVariant = list.find(p => productHasMatchingMetalVariant(p, desiredColorsForTarget))
			if (withVariant?.handle) return withVariant.handle
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
		const hasStored = Array.isArray(stored) && stored.length
		const displayBase = new Array(collectionMaxRings).fill(null)
		if (hasStored) {
			for (let i = 0; i < Math.min(collectionMaxRings, stored.length); i++) {
				displayBase[i] = stored[i] || null
			}
		}

		// If we just navigated here from another stackable product, apply the exact target
		// Metal option value string (prevents "metal not selected" + wrong images).
		const pending = readPendingStackable()
		if (pending?.handle && pending.handle === product?.handle && pending?.metalValueName) {
			// Prefer keeping the user's UI selection (stored) if present.
			const baseForUI = hasStored ? displayBase : new Array(collectionMaxRings).fill(null)
			if (!hasStored) {
				const colors = parseMetalColors(pending.metalValueName)
				activeRingPositions.forEach((pos, i) => {
					baseForUI[pos] = colors[i] || null
				})
			}
			setStackableColors(baseForUI)

			// Apply the exact metal value (avoid relying on matching heuristics).
			const exists = option.optionValues.some(v => v?.name === pending.metalValueName)
			if (exists) {
				const variantColors = parseMetalColors(pending.metalValueName)
				const colorCodes = variantColors.map(c => c[0].toUpperCase()).join('')
				if (setSelectedColor) {
					if (variantColors.length <= 1) setSelectedColor(pending.metalValueName)
					else setSelectedColor(`Stackable-${colorCodes}`)
				}
				if (
					handleOptionSelection &&
					selectedOptions?.[option.name] !== pending.metalValueName
				) {
					handleOptionSelection(option.name, pending.metalValueName, null)
				}
			} else {
				// Fallback: apply via canonical colors.
				const canonical = normalizeStackableForLogic(baseForUI)
				applyColorsToThisProduct(canonical)
			}

			clearPendingStackable()
			return
		}

		const base = hasStored ? displayBase : new Array(collectionMaxRings).fill(null)
		if (!hasStored) {
			const initialMetal =
				selectedOptions?.[option.name] ||
				product?.variants?.edges?.[0]?.node?.selectedOptions?.find(
					so => so?.name === 'Metal'
				)?.value ||
				null
			const colors = parseMetalColors(initialMetal)
			activeRingPositions.forEach((pos, i) => {
				base[pos] = colors[i] || normalizedGoldFromUrl || defaultStackableColor
			})
		}

		// Direct landing override: if the URL specifies a single metal (e.g. gold=yellow),
		// force all active rings to that color (UI + logic).
		if (isSingleGoldParam && normalizedGoldFromUrl) {
			activeRingPositions.forEach(pos => {
				base[pos] = normalizedGoldFromUrl
			})
		}

		setStackableColors(base)

		// Apply canonical (logic) selection without mutating what UI shows.
		const canonical = normalizeStackableForLogic(base)
		// Ensure all required positions for this product are selected in logic,
		// otherwise Metal won't match any variant (blocks "Review your order").
		activeRingPositions.forEach(pos => {
			if (!canonical[pos]) {
				canonical[pos] = normalizedGoldFromUrl || defaultStackableColor
			}
		})
		applyColorsToThisProduct(canonical)
	}, [
		activeRingPositions,
		applyColorsToThisProduct,
		clearPendingStackable,
		collectionMaxRings,
		defaultStackableColor,
		handleOptionSelection,
		isStackableRings,
		isMetalOption,
		isSingleGoldParam,
		normalizeStackableForLogic,
		option?.name,
		option?.optionValues,
		normalizedGoldFromUrl,
		parseMetalColors,
		product?.handle,
		product?.variants?.edges,
		readPendingStackable,
		readStoredStackableColors,
		selectedOptions,
		setSelectedColor,
		stackableColors.length
	])

	// Handle individual ring color selection for stackable rings
	const handleStackableColorChange = (ringIndex, color) => {
		const next = [...stackableColors]
		// Toggle: click same color again to deselect that ring.
		// But never allow the entire selection to become empty (e.g. single ring should
		// not be able to toggle off to "none selected", even if the selected one is Third).
		const isDeselecting = next[ringIndex] === color
		const selectedCount = next.filter(Boolean).length
		if (isDeselecting && selectedCount <= 1) {
			return
		}
		next[ringIndex] = isDeselecting ? null : color

		// Persist/display exactly what the user clicked (UI correctness).
		setStackableColors(next)
		writeStoredStackableColors(next)

		// Use a canonical selection for logic (routing + variant matching).
		const canonical = normalizeStackableForLogic(next)

		const hasFirst = !!canonical[0]
		const hasSecond = !!canonical[1]
		const hasThird = !!canonical[2]

		let targetRings = null
		let targetSideDiamond = null
		let desiredForTarget = null

		if (hasFirst && hasSecond && hasThird) {
			targetRings = 3
			desiredForTarget = [canonical[0], canonical[1], canonical[2]]
		} else if (hasFirst && !hasSecond && hasThird) {
			targetRings = 2
			targetSideDiamond = true
			desiredForTarget = [canonical[0], canonical[2]]
		} else if (hasFirst && hasSecond && !hasThird) {
			targetRings = 2
			targetSideDiamond = false
			desiredForTarget = [canonical[0], canonical[1]]
		} else if (hasFirst && !hasSecond && !hasThird) {
			targetRings = 1
			targetSideDiamond = true
			desiredForTarget = [canonical[0]]
		} else if (!hasFirst && hasSecond && !hasThird) {
			targetRings = 1
			targetSideDiamond = false
			desiredForTarget = [canonical[1]]
		}

		if (!targetRings) return
		if (targetRings > collectionMaxRings) return

		const targetHandle = findTargetHandle(targetRings, targetSideDiamond, desiredForTarget)
		if (targetHandle && targetHandle !== product?.handle) {
			// Persist the exact target Metal option value name so the destination page can
			// apply a valid variant immediately (fixes First+Second sometimes not selecting Metal).
			const candidates = [product, ...stackableProductsInCollection]
			const targetProduct = candidates.find(p => p?.handle === targetHandle) || null
			const targetMetalValueName =
				targetProduct && desiredForTarget
					? findMatchingMetalValueName(targetProduct, desiredForTarget)
					: null
			if (targetMetalValueName) {
				writePendingStackable({
					handle: targetHandle,
					metalValueName: targetMetalValueName
				})
			}
			return navigateToHandle(targetHandle)
		}

		// Same product: apply selection to metal variant + images
		applyColorsToThisProduct(canonical)
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
				shouldKeepSizeOpen ||
				(isCustomShape ? true : index === openOption)
			}
			setOpenOption={() => {
				if (shouldKeepSizeOpen) {
					// Keep Size accordion open at its index
					setOpenOption(index)
				} else {
					setOpenOption(
						isCustomShape ||
							product.tags.includes('CustomShape') ||
							product.tags.includes('Stackable Rings')
							? 0
							: index
					)
				}
			}}
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
