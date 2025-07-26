'use client'

// styles
import styles from './ProductInfo.module.scss'

// components
import Image from 'next/image'
import Accordion from './Accordion'
import NeedHelpInfo from './NeedHelpInfo'

// hooks
import { useState, useEffect } from 'react'

// helpers
import parse from 'html-react-parser'
import { returnMetalType, returnDiamondShape } from '@/lib/helpers'

const ProductOptionsUI = ({
	product,
	selectedColor,
	setSelectedColor,
	matchingVariant,
	setMatchingVariant,
	engraving,
	setEngraving,
	boxText,
	setBoxText,
	boxColor,
	setBoxColor,
	setShowOrderSummary
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

	const boxColorOptions = [
		{ backgroundColor: '#b8a3ee', boxColor: 'Lavender' },
		{ backgroundColor: '#5d8059', boxColor: 'Green' },
		{ backgroundColor: '#bababa', boxColor: 'Light-Grey' },
		{ backgroundColor: '#999999', boxColor: 'Dark-Grey' }
	]

	const materialInfo = [
		{
			icon: '/polish-icon.png',
			title: 'Metal',
			text: 'To ensure quality and longevity, each of our pieces is crafted using certified 100% repurposed 14k solid white or yellow gold.'
		},
		{
			icon: '/sustainability-icon.png',
			title: 'Sustainability',
			text: 'Aligned with our values and ethics, every piece features lab-grown diamonds created through CVD and HPHT methods . Meeting the highest standards in color (D, E, F) and clarity (FL). We believe in responsible production and conscious consumption.'
		},
		{
			icon: '/warranty-icon.png',
			title: 'Practices',
			text: 'We believe in clean practices, not just for the planet, but for the people we serve. Fair pricing, stable value, privacy-first policies, and a seamless buying experience are all part of our commitment to honest, transparent, and effective standards across every touchpoint of the brand.'
		},
		{
			icon: '/polish-icon.png',
			title: 'Care',
			text: 'Every purchase includes one year of free  polishing and cleaning. While our 14k solid gold and lab-grown diamond pieces are built to last, we recommend avoiding harsh chemicals, storing them separately, and cleaning them gently with mild soap and water.'
		},
		{
			icon: '/return-icon.png',
			title: 'Shipping',
			text: 'Free shipping for purchases above $300.'
		}
	]

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
				FROM $
				{Number(matchingVariant.price.amount.slice(0, -2)).toLocaleString()}
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
						<div className={styles.variantButtonsContainer}>
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
									{value.name}
								</button>
							))}
						</div>
					</Accordion>
				))}

				{product.category.name !== 'Earrings' && (
					/* Engraving */
					<Accordion
						// small
						title='Engraving'
						extraTitleText={engraving ? `"${engraving}"` : null}
						state={openOption === product.options.length}
						product
						display
					>
						<div className={styles.inputContainer}>
							<div className={styles.inputText}>
								<p>
									Personalize your jewelry with a message that lasts a lifetime.
								</p>

								<input
									type='text'
									placeholder={
										product.category.name === 'Rings'
											? 'Type up to 15 characters'
											: 'Type up to 10 characters'
									}
									value={engraving}
									onChange={e => setEngraving(e.target.value)}
									className={styles.engravingInput}
									maxLength={product.category.name === 'Rings' ? 20 : 10}
								/>
								<p
									style={{
										fontSize: '10px',
										fontStyle: 'italic'
									}}
								>
									*Additional $20
								</p>
							</div>

							{/* <div className={styles.inputImage}>
								<Image
									src='/engraving-image.jpg'
									alt='Engraving Image'
									fill
									style={{ objectFit: 'cover' }}
								/>
							</div> */}
						</div>
					</Accordion>
				)}

				{/* Boxes */}
				<Accordion
					// small
					title='Make Your Box Truly Yours'
					extraTitleText={boxText ? `"${boxText}"` : null}
					state={openOption === product.options.length}
					product
					display
				>
					<div className={styles.inputContainer}>
						<div className={styles.inputText}>
							<p>
								Personalize it with a special touch to create a unique and
								memorable keepsake.
							</p>

							<p>Message Color:</p>

							<div className={styles.boxColors}>
								{boxColorOptions.map((option, index) => (
									<button
										key={index}
										style={{
											backgroundColor: option.backgroundColor,
											border:
												boxColor === option.boxColor
													? '1px solid black'
													: 'none'
										}}
										onClick={() => setBoxColor(option.boxColor)}
									></button>
								))}
							</div>

							<textarea
								className={styles.boxInput}
								value={boxText}
								onChange={e => setBoxText(e.target.value)}
								placeholder='Type up to 25 characters'
								maxLength={60}
							/>

							<p
								style={{
									fontSize: '10px',
									fontStyle: 'italic'
								}}
							>
								*Additional $50
							</p>
						</div>

						<div className={styles.inputImage}>
							<Image
								src={
									boxColor
										? `/box-image-${boxColor.toLowerCase()}.jpg`
										: '/box-image-lavender.jpg'
								}
								alt='Box Image'
								fill
								style={{ objectFit: 'cover' }}
							/>
						</div>
					</div>
				</Accordion>
			</div>

			<a
				href='#order-review'
				onClick={() => setShowOrderSummary(true)}
				style={{ pointerEvents: allOptionsSelected ? 'auto' : 'none' }}
			>
				<button className={styles.cartButton} disabled={!allOptionsSelected}>
					REVIEW YOUR ORDER
				</button>
			</a>

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
						standards and 100% certified recycled solid gold. We honor timeless
						design and exceptional craftsmanship, creating heirloom-quality fine
						jewelry made to last for generations.
					</p>
				</Accordion>
			</div>
		</div>
	)
}

export default ProductOptionsUI
