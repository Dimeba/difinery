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

// context
import { useCart } from '@/context/CartContext'

const ProductOptionsUI = ({
	product,
	setSelectedColor,
	matchingVariant,
	setMatchingVariant,
	engraving,
	setEngraving,
	birthStone,
	setBirthstone,
	ringSize,
	setRingSize,
	setShowOrderSummary
}) => {
	const { cart, addToCart, showCart, setShowCart } = useCart()

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

	// Reset all options
	// const handleReset = () => {
	// 	setSelectedOptions({})
	// 	setOpenOption(0)
	// 	setMatchingVariant(product.variants.edges[0].node)
	// 	setSelectedColor(null)
	// 	setEngraving('')
	// 	setBirthstone('')
	// 	setRingSize('')
	// }

	const allOptionsSelected =
		Object.keys(selectedOptions).length === product.options.length

	const birthstones = [
		{ month: 'January', stones: ['Garnet'] },
		{ month: 'February', stones: ['Amethyst'] },
		{ month: 'March', stones: ['Aquamarine', 'Bloodstone'] },
		{ month: 'April', stones: ['Diamond'] },
		{ month: 'May', stones: ['Emerald'] },
		{ month: 'June', stones: ['Pearl', 'Moonstone', 'Alexandrite'] },
		{ month: 'July', stones: ['Ruby'] },
		{ month: 'August', stones: ['Peridot', 'Sardonyx', 'Spinel'] },
		{ month: 'September', stones: ['Sapphire'] },
		{ month: 'October', stones: ['Opal', 'Tourmaline'] },
		{ month: 'November', stones: ['Topaz', 'Citrine'] },
		{ month: 'December', stones: ['Turquoise', 'Zircon', 'Tanzanite'] }
	]

	return (
		<div className={styles.content}>
			<div className={styles.versionInfo}>
				<h3>{product.title}</h3>
				{/* {Object.keys(selectedOptions).length > 0 && (
					<p>
						{Object.values(selectedOptions).join(' / ')}{' '}
						<span className={styles.resetButton} onClick={handleReset}>
							Reset All
						</span>
					</p>
				)} */}
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
						<input
							type='text'
							placeholder='Add your text here'
							value={engraving}
							onChange={e => setEngraving(e.target.value)}
							className={styles.engravingInput}
							maxLength={20}
						/>
						<p
							style={{
								fontSize: '10px',
								fontStyle: 'italic',
								marginTop: '0.5rem'
							}}
						>
							*Max 20 characters. We recommend up to 15.
						</p>
					</Accordion>
				)}
			</div>

			<div className={styles.reviewOrderButtons}>
				{/* <button className={styles.personailzeButton}>PERSONALIZE IT</button> */}

				<a
					href='#order-review'
					onClick={() => setShowOrderSummary(true)}
					style={{ pointerEvents: allOptionsSelected ? 'auto' : 'none' }}
				>
					<button
						className={styles.reviewOrderButton}
						disabled={!allOptionsSelected}
					>
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
