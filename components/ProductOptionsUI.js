'use client'

// styles
import styles from './ProductInfo.module.scss'

// components
import Image from 'next/image'
import Accordion from './Accordion'

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

	const ringSizes = [
		'4',
		'4.5',
		'5',
		'5.5',
		'6',
		'6.5',
		'7',
		'7.5',
		'8',
		'8.5',
		'9',
		'9.5',
		'10',
		'10.5',
		'11',
		'11.5',
		'12'
	]

	const toggleRingSize = value => {
		if (ringSize === value) {
			setRingSize('')
			setShowOrderSummary(false)
		} else {
			setRingSize(value)
		}
	}

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

				{product.category.name === 'Rings' && (
					<>
						{/* Ring Size */}
						<Accordion
							// small
							title='Ring Size'
							extraTitleText={ringSize ? ringSize : null}
							state={openOption === product.options.length}
							setOpenOption={() => setOpenOption(product.options.length + 1)}
							product
							display
						>
							<div className={styles.variantButtonsContainer}>
								{ringSizes.map(value => (
									<button
										key={value}
										className={styles.variantButton}
										onClick={() => toggleRingSize(value)}
										style={{
											fontWeight: ringSize === value ? 'bold' : 'normal'
										}}
									>
										{value}
									</button>
								))}
							</div>
						</Accordion>

						{/* Engraving */}
						<Accordion
							// small
							title='Engraving (max. 20 characters)'
							state={openOption === product.options.length + 1}
							product
							display
							// setOpenOption={() => setOpenOption(filteredOptions.length)}
						>
							<input
								type='text'
								placeholder='Add your text here'
								value={engraving}
								onChange={e => setEngraving(e.target.value)}
								className={styles.engravingInput}
								maxLength={20}
							/>
						</Accordion>
					</>
				)}

				{/* {(product.category.name === 'Rings' ||
					product.category.name === 'Pendants') && (
					<Accordion
						small
						title='Birthstone'
						state={openOption === filteredOptions.length}
						product
						display
						setOpenOption={() => setOpenOption(filteredOptions.length)}
					>
						<select
							className={styles.select}
							value={birthstone}
							onChange={e => setBirthstone(e.target.value)}
						>
							<option value=''>Select birthstone</option>
							{birthstones.map(({ month, stones }) => (
								<optgroup label={month} key={month}>
									{stones.map(stone => (
										<option value={stone} key={stone}>
											{stone}
										</option>
									))}
								</optgroup>
							))}
						</select>
					</Accordion>
				)} */}
			</div>

			{allOptionsSelected &&
				(product.category.name !== 'Rings' || ringSize !== '') && (
					<div className={styles.reviewOrderButtons}>
						{/* <button className={styles.personailzeButton}>PERSONALIZE IT</button> */}

						<a href='#order-review' onClick={() => setShowOrderSummary(true)}>
							<button className={styles.reviewOrderButton}>
								REVIEW YOUR ORDER
							</button>
						</a>
					</div>
				)}

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
