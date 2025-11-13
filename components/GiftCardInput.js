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

		// Update display text immediately only if value is in valid range
		if (value && onDisplayUpdate) {
			const numValue = parseInt(value)

			// Only update if within valid range
			if (numValue >= minValue && numValue <= maxValue) {
				onDisplayUpdate(`$${numValue}`)
			} else {
				// Clear selection if value is out of range
				onDisplayUpdate(null)
			}
		} else if (!value && onDisplayUpdate) {
			// Clear selection if input is empty
			onDisplayUpdate(null)
		}
	}

	const handleInputBlur = async () => {
		if (!inputValue) return

		const numValue = parseInt(inputValue)

		// Only proceed if value is in valid range
		if (numValue < minValue || numValue > maxValue) {
			return // Don't select invalid values
		}

		// Round to nearest valid value (multiples of 10)
		const roundedValue = Math.round(numValue / 10) * 10
		const finalValue = Math.max(minValue, Math.min(maxValue, roundedValue))
		const formattedValue = `$${finalValue}`

		// Update display first and wait for state to settle
		if (onDisplayUpdate) {
			onDisplayUpdate(formattedValue)
			// Give React time to process the state update
			await new Promise(resolve => setTimeout(resolve, 0))
		}

		// Then finalize selection
		onSelect(formattedValue)
		setInputValue(finalValue.toString())
	}

	// Format display value with comma
	const displayValue = inputValue
		? inputValue.replace(/^(\d)(\d{3,})$/, '$1,$2')
		: ''

	// Update input when selectedValue changes externally (only on mount)
	useEffect(() => {
		if (selectedValue && !inputValue) {
			const numValue = selectedValue.replace(/[$,]/g, '')
			setInputValue(numValue)
		}
	}, [])

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
					onBlur={handleInputBlur}
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
