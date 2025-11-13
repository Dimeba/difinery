'use client'

// styles
import styles from './ProductInfo.module.scss'

// components
import Image from 'next/image'
import Accordion from './Accordion'
import NeedHelpInfo from './NeedHelpInfo'
import Engraving from './Engraving'
import CustomBox from './CustomBox'
import GiftCardInput from './GiftCardInput'

// hooks
import { useState, useEffect } from 'react'
import { useMediaQuery } from '@mui/material'

// helpers
import parse from 'html-react-parser'
import { returnMetalType, returnDiamondShape } from '@/lib/helpers'

// data
import materialInfo from '@/data/materialInfo.json' with { type: 'json' }

const ProductOptionsUI = ({
	product,
	isGiftCard = false,
	selectedColor,
	setSelectedColor,
	selectedShape,
	setSelectedShape,
	matchingVariant,
	setMatchingVariant,
	engraving,
	setEngraving,
	setEngravingVariant,
	boxText,
	setBoxText,
	boxVariant,
	setBoxVariant,
	setShowOrderSummary,
	handleAddToCart
}) => {
	const isMobile = useMediaQuery('(max-width: 1024px)')
	const [openOption, setOpenOption] = useState(selectedColor ? 1 : 0)
	const [selectedOptions, setSelectedOptions] = useState(() => {
		const initialOptions = {}
		if (selectedColor) {
			initialOptions['Metal'] = selectedColor
		}
		return initialOptions
	})

	// Find the Shopify variant node matching the selected options
	const getMatchingVariant = options => {
		const selectedEntries = Object.entries(options)
		const matchingEdge = product.variants.edges.find(({ node }) =>
			selectedEntries.every(([name, value]) =>
				node.selectedOptions.some(so => so.name === name && so.value === value)
			)
		)
		if (matchingEdge) {
			setMatchingVariant(matchingEdge.node)
			return true
		} else {
			// Only log error if all required options are selected
			if (Object.keys(options).length === product.options.length) {
				console.error('No matching variant found')
			}
			return false
		}
	}

	// User selects an option value
	const handleOptionSelection = (optionName, value, index) => {
		// If user clicks the same value again, clear it
		if (selectedOptions[optionName] === value) {
			return handleOptionReset(optionName)
		}

		// 1) update selectedOptions map
		const newSelected = { ...selectedOptions, [optionName]: value }
		setSelectedOptions(newSelected)

		// 2) update matchingVariant
		getMatchingVariant(newSelected)

		// 3) advance to next dropdown
		setOpenOption(index + 1)

		// 4) set selected color/shape if applicable (to drive image filtering)
		if (optionName === 'Metal') {
			setSelectedColor(value)
		} else if (optionName.toLowerCase() === 'diamond shape') {
			setSelectedShape(value)
		}
	}

	// Update display without advancing accordion (for gift card input)
	const handleDisplayUpdate = (optionName, value) => {
		if (value === null) {
			// Remove the option to unselect variant
			const newSelected = { ...selectedOptions }
			delete newSelected[optionName]
			setSelectedOptions(newSelected)
			// Don't clear matchingVariant - keep the first variant as default
			return
		}
		
		const newSelected = { ...selectedOptions, [optionName]: value }
		
		// Check if variant exists for this value
		const variantExists = product.variants.edges.some(({ node }) =>
			node.selectedOptions.some(so => so.name === optionName && so.value === value)
		)
		
		if (variantExists) {
			setSelectedOptions(newSelected)
			// Only try to match variant if all required options are present
			if (Object.keys(newSelected).length === product.options.length) {
				getMatchingVariant(newSelected)
			}
		} else {
			// Still update selectedOptions for display, but don't try to match variant
			setSelectedOptions(newSelected)
		}
	}

	// Reset a single option
	const handleOptionReset = optionName => {
		const newSelected = { ...selectedOptions }
		delete newSelected[optionName]
		setSelectedOptions(newSelected)
		getMatchingVariant(newSelected)
		setShowOrderSummary(false)

		if (optionName === 'Metal') {
				setSelectedColor(null)
			} else if (optionName.toLowerCase() === 'diamond shape') {
				setSelectedShape(null)
			}
	}

	const allOptionsSelected =
		Object.keys(selectedOptions).length === product.options.length && matchingVariant !== null

	const details = product.descriptionHtml.replace(
		/<p\s+id=(["'])description\1[^>]*>[\s\S]*?<\/p>/i,
		''
	)

	const match = product.descriptionHtml.match(
		/<p\s+id=(['"])description\1[^>]*>[\s\S]*?<\/p>/i
	)
	const description = match ? match[0] : ''

	useEffect(() => {
		if (selectedColor) {
			getMatchingVariant({ ...selectedOptions, Metal: selectedColor })
		}
	}, [])

	return (
		<div className={styles.content}>
			<div className={styles.versionInfo}>
				<h3>{product.title}</h3>
			</div>

			{matchingVariant && (
				<p>
					{' '}
					${Number(matchingVariant.price.amount.slice(0, -2)).toLocaleString()}
				</p>
			)}

			<div className={styles.description}>{isGiftCard ? parse(product.descriptionHtml) : parse(description)}</div>

			<div className={styles.accordion}>
				{product.options.map((option, index) => (
					<Accordion
						key={option.name}
						// small
						title={option.name}
						extraTitleText={
							selectedOptions[option.name] 
								? isGiftCard 
									? selectedOptions[option.name].replace(/^(\$)(\d)(\d{3})$/, '$1$2,$3')
									: selectedOptions[option.name]
								: null
						}
						state={index === openOption}
						setOpenOption={() => setOpenOption(index)}
						product
						display
						showHelp={
							option.name.toLowerCase() === 'ring size' ||
							option.name === 'carat'
						}
						// helpContent={<NeedHelpInfo type={option.name.toLowerCase()} />}
						helpLink={isMobile ? '/Size-Guide-Difinery-Mobile.pdf' : '/Size-Guide-Difinery-Desktop.pdf'}
					>
						<div
							className={styles.variantButtonsContainer}
						>
							{isGiftCard ? (
								<GiftCardInput
									options={option.optionValues}
									selectedValue={selectedOptions[option.name] || null}
									onSelect={(value) => handleOptionSelection(option.name, value, index)}
									onDisplayUpdate={(value) => handleDisplayUpdate(option.name, value)}
								/>
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
					</Accordion>
				))}

				{product.category.name !== 'Earrings' && !isGiftCard && (
					/* Engraving */
					<Accordion
						// small
						title='Engraving'
						extraTitleText={engraving ? `"${engraving}"` : null}
						state={openOption === product.options.length}
						product
						display
					>
						<Engraving
							product={product}
							engraving={engraving}
							setEngraving={setEngraving}
							setEngravingVariant={setEngravingVariant}
						/>
					</Accordion>
				)}

				{/* Boxes */}
				{!isGiftCard && (
					<Accordion
						// small
						title='Customize Your Canvas Box'
						extraTitleText={boxText ? `"${boxText}"` : null}
						state={openOption === product.options.length}
						product
						display
					>
						<CustomBox
							boxVariant={boxVariant}
							setBoxVariant={setBoxVariant}
							boxText={boxText}
							setBoxText={setBoxText}
						/>
					</Accordion>
				)}
			</div>

			{!isGiftCard ? (
				<a
					href='#order-review'
					onClick={() => {
						setShowOrderSummary(true)
						handleAddToCart()
					}}
					style={{ pointerEvents: allOptionsSelected ? 'auto' : 'none' }}
				>
					<button className={styles.cartButton} disabled={!allOptionsSelected}>
						REVIEW YOUR ORDER
					</button>
				</a>
			) : (
				<>
					<button
						className={styles.cartButton}
						onClick={handleAddToCart}
						disabled={!allOptionsSelected}
					>
						Go to Cart
					</button>
				</>
			)}

			{!isGiftCard && (
				<div>
					<Accordion title='Product Details'>
						<div className={styles.productDetails}>
							<p>
								<span>Product Name: </span>
								{product.title}
							</p>
							{matchingVariant && (
								<p>
									<span>ID / SKU: </span>
									{matchingVariant.sku}
								</p>
							)}
							{selectedColor && (
								<p>
									<span>Metal: </span>
									{selectedColor.toLowerCase().includes('yellow') ? (
										<span>Yellow Gold</span>
									) : (
										<span>White Gold</span>
									)}
								</p>
							)}
							{parse(details)}
						</div>
					</Accordion>

					<Accordion title='Material'>
						<div
							style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
						>
							{materialInfo.map((info, index) => (
								<div key={index} className={styles.materialInfo}>
									<Image src={info.icon} width={32} height={32} alt='Icon' />
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											gap: '0.25rem'
										}}
									>
										<p style={{ fontWeight: '700' }}>{info.title}</p>
										<p>{info.text}</p>
									</div>
								</div>
							))}
						</div>
					</Accordion>

					<Accordion title='Handcrafted in USA'>
						<p>
							Each one of our pieces are handcrafted in New York's Diamond
							District using only ethical lab-grown diamonds of the highest
							standards and 100% certified recycled solid gold. We honor
							timeless design and exceptional craftsmanship, creating
							heirloom-quality fine jewelry made to last for generations.
						</p>
					</Accordion>
				</div>
			)}
		</div>
	)
}

export default ProductOptionsUI
