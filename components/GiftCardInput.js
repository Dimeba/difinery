'use client'

// styles
import styles from './ProductInfo.module.scss'

// hooks
import { useState, useEffect } from 'react'

const GiftCardInput = ({
	options,
	selectedValue,
	onSelect,
	onDisplayUpdate
}) => {
	const [inputValue, setInputValue] = useState('')

	// Parse available values from option names (e.g., "$1000" -> 1000)
	const availableValues = options
		.map(opt => parseInt(opt.name.replace('$', '')))
		.sort((a, b) => a - b)

	const minValue = Math.min(...availableValues)
	const maxValue = Math.max(...availableValues)

	const handleInputChange = e => {
		const value = e.target.value.replace(/[^0-9]/g, '') // Only allow numbers
		setInputValue(value)

		if (!value) {
			// Clear selection if input is empty
			if (onDisplayUpdate) {
				onDisplayUpdate(null)
			}
			return
		}

		const numValue = parseInt(value)

		// Round to nearest valid value (multiples of 10)
		const roundedValue = Math.round(numValue / 10) * 10
		const finalValue = Math.max(minValue, Math.min(maxValue, roundedValue))

		// Only select if within valid range
		if (numValue >= minValue && numValue <= maxValue) {
			const formattedValue = `$${finalValue}`

			// Update display
			if (onDisplayUpdate) {
				onDisplayUpdate(formattedValue)
			}

			// Select the value
			onSelect(formattedValue)
		} else {
			// Clear selection if out of range
			if (onDisplayUpdate) {
				onDisplayUpdate(null)
			}
		}
	}

	// Format display value with comma
	const displayValue = inputValue
		? inputValue.replace(/^(\d)(\d{3,})$/, '$1,$2')
		: ''

	// Update input when selectedValue changes externally
	useEffect(() => {
		if (selectedValue && !inputValue) {
			const numValue = selectedValue.replace(/[$,]/g, '')
			setInputValue(numValue)
		}
	}, [selectedValue, inputValue])

	return (
		<div className={styles.giftCardInput}>
			<p>
				Enter an amount between ${minValue.toLocaleString()} and $
				{maxValue.toLocaleString()}.
			</p>

			<div className={styles.inputWrapper}>
				<span className={styles.dollarSign}>$</span>
				<input
					type='text'
					value={displayValue}
					onChange={handleInputChange}
					placeholder={`${minValue.toLocaleString()}`}
					className={styles.engravingInput}
				/>
			</div>

			<p
				style={{
					fontSize: '10px',
					fontStyle: 'italic'
				}}
			>
				*Amounts will be rounded to the nearest $10.
			</p>
		</div>
	)
}

export default GiftCardInput
