'use client'

// styles
import styles from './ProductInfo.module.scss'

// components
import Image from 'next/image'
import Accordion from './Accordion'
import NeedHelpInfo from './NeedHelpInfo'

// hooks
import { useState } from 'react'

// helpers
import { returnMetalType } from '@/lib/helpers'

const ProductOptionsUI = ({
	product,
	setSelectedColor,
	matchingVariant,
	setMatchingVariant,
	engraving,
	setEngraving,
	boxText,
	setBoxText,
	setShowOrderSummary
}) => {
	const [openOption, setOpenOption] = useState(0)
	const [selectedOptions, setSelectedOptions] = useState({})

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

			<p className={styles.description}>{product.description}</p>

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
									{option.name === 'Metal' && (
										<Image
											src={`/${returnMetalType(value.name.toLowerCase())}`}
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
									placeholder='Add your text here'
									value={engraving}
									onChange={e => setEngraving(e.target.value)}
									className={styles.engravingInput}
									maxLength={25}
								/>
								<p
									style={{
										fontSize: '10px',
										fontStyle: 'italic'
									}}
								>
									*Max 20 characters. We recommend up to 15.
								</p>
							</div>

							<div className={styles.inputImage}>
								<Image
									src='/engraving-image.jpg'
									alt='Engraving Image'
									fill
									style={{ objectFit: 'cover' }}
								/>
							</div>
						</div>
					</Accordion>
				)}

				{/* Boxes */}
				<Accordion
					// small
					title='Box'
					extraTitleText={boxText ? `"${boxText}"` : null}
					state={openOption === product.options.length}
					product
					display
				>
					<div className={styles.inputContainer}>
						<div className={styles.inputText}>
							<p>Personalize Your White Canvas.</p>

							<input
								type='text'
								placeholder='Add your text here'
								value={boxText}
								onChange={e => setBoxText(e.target.value)}
								className={styles.engravingInput}
								maxLength={25}
							/>
							<p
								style={{
									fontSize: '10px',
									fontStyle: 'italic'
								}}
							>
								*Max 25 characters. We recommend up to 20.
							</p>
						</div>

						<div className={styles.inputImage}>
							<Image
								src='/box-image.jpg'
								alt='Box Image'
								fill
								style={{ objectFit: 'cover' }}
							/>
						</div>
					</div>
				</Accordion>
			</div>

			<div className={styles.reviewOrderButtons}>
				{/* <button className={styles.personailzeButton}>PERSONALIZE IT</button> */}

				<a
					href='#order-review'
					onClick={() => setShowOrderSummary(true)}
					style={{ pointerEvents: allOptionsSelected ? 'auto' : 'none' }}
				>
					<button className={styles.cartButton} disabled={!allOptionsSelected}>
						REVIEW YOUR ORDER
					</button>
				</a>
			</div>

			{/* <div className={styles.cartBox}>
				<p className={styles.orderDate}>
					Made to Order: Between {new Date().toLocaleDateString()}–{' '}
					{new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}{' '}
					with you.
				</p>

				<p className={styles.tax}>
					Tax included
					<br />
					Shipping calculated at checkout.
					<br />
					<b>
						$15 of your purchase goes to The New York Women&apos;s Foundation
					</b>
				</p>
			</div> */}
		</div>
	)
}

export default ProductOptionsUI
