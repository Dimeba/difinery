'use client'

// styles
import styles from './ProductInfo.module.scss'

// components
import Image from 'next/image'
import Accordion from './Accordion'
import NeedHelpInfo from './NeedHelpInfo'
import Engraving from './Engraving'
import CustomBox from './CustomBox'

// hooks
import { useState, useEffect } from 'react'

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
		} else {
			console.error('No matching variant found')
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

		// 4) set selected color if applicable
		if (optionName === 'Metal') {
			setSelectedColor(value)
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
		}
	}

	const allOptionsSelected =
		Object.keys(selectedOptions).length === product.options.length

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

			<p>
				{' '}
				${Number(matchingVariant.price.amount.slice(0, -2)).toLocaleString()}
			</p>

			<div>{parse(description)}</div>

			<div className={styles.accordion}>
				{product.options.map((option, index) => (
					<Accordion
						key={option.name}
						// small
						title={option.name}
						extraTitleText={
							selectedOptions[option.name] ? selectedOptions[option.name] : null
						}
						state={index === openOption}
						setOpenOption={() => setOpenOption(index)}
						product
						display
						showHelp={
							option.name.toLowerCase() === 'ring size' ||
							option.name === 'carat'
						}
						helpContent={<NeedHelpInfo type={option.name.toLowerCase()} />}
					>
						<div
							className={styles.variantButtonsContainer}
							style={{
								flexDirection: isGiftCard ? 'column' : '',
								alignItems: isGiftCard ? 'flex-start' : '',
								marginTop: isGiftCard ? '2rem' : '0'
							}}
						>
							{option.optionValues.map(value => (
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
									{isGiftCard ? value.name.slice(0, -3) : value.name}
								</button>
							))}
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
						title='Make Your Box Truly Yours'
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
								<span style={{ fontWeight: '700' }}>Product Name: </span>
								{product.title}
							</p>
							{matchingVariant && (
								<p>
									<span style={{ fontWeight: '700' }}>ID / SKU: </span>
									{matchingVariant.sku}
								</p>
							)}
							{selectedColor && (
								<p>
									<span style={{ fontWeight: '700' }}>Metal: </span>
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
