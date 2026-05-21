'use client'

import { useState } from 'react'
import { Grid, TextField, Button, Box, Typography } from '@mui/material'

const KlaviyoForm = ({
	fields = [],
	submitText = 'Submit',
	customButton,
	columns = 1,
	isWhite = false,
	solidSubmit = false,
	centerSubmit = false,
	listName = 'default'
}) => {
	const [formData, setFormData] = useState({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitStatus, setSubmitStatus] = useState(null)

	const handleChange = fieldName => e => {
		setFormData({
			...formData,
			[fieldName]: e.target.value
		})
	}

	const handleSubmit = async e => {
		e.preventDefault()

		// Validate required fields
		const missingRequiredFields = fields.filter((field, index) => {
			const fieldName = field.name || `field-${index}`
			return field.required === true && !formData[fieldName]?.trim()
		})

		if (missingRequiredFields.length > 0) {
			setSubmitStatus('error')
			return
		}

		setIsSubmitting(true)
		setSubmitStatus(null)

		try {
			const response = await fetch('/api/klaviyo', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					listName,
					data: formData
				})
			})

			const result = await response.json()

			if (response.ok) {
				setSubmitStatus('success')
				setFormData({})
			} else {
				// Check for specific error types
				if (result.errorType === 'phone') {
					setSubmitStatus('phone_error')
				} else {
					setSubmitStatus('error')
				}
			}
		} catch (error) {
			setSubmitStatus('error')
		} finally {
			setIsSubmitting(false)
		}
	}

	const getGridSize = () => {
		// Calculate grid size based on columns prop
		// 12 / columns = size per field
		return { xs: 12 / columns }
	}

	// Set colors based on isWhite prop
	const textColor = isWhite ? '#ffffff' : '#000000'
	const placeholderColor = isWhite
		? 'rgba(255, 255, 255, 0.8)'
		: 'rgba(0, 0, 0, 0.5)'
	const borderColor = isWhite
		? 'rgba(255, 255, 255, 0.8)'
		: 'rgba(0, 0, 0, 0.42)'

	return (
		<form
			onSubmit={handleSubmit}
			style={{ width: '100%' }}
			data-list-name={listName}
		>
			<Grid
				container
				rowSpacing='1rem'
				columnSpacing={{ xs: '1rem', lg: '2rem' }}
			>
				{fields.map((field, index) => (
					<Grid key={index} size={getGridSize()}>
						<TextField
							id={field.name || `field-${index}`}
							name={field.name || `field-${index}`}
							type={field.type || 'text'}
							placeholder={field.placeholder || ''}
							value={formData[field.name || `field-${index}`] || ''}
							onChange={handleChange(field.name || `field-${index}`)}
							variant='standard'
							fullWidth
							required={field.required === true}
							sx={{
								'& .MuiInputBase-input': {
									fontSize: '12px',
									color: textColor,
									padding: '0.5rem 0'
								},
								'& .MuiInputBase-input::placeholder': {
									fontSize: '12px',
									color: placeholderColor,
									opacity: 1
								},
								'& .MuiInputLabel-root': {
									fontSize: '14px',
									color: textColor
								},
								'& .MuiInput-underline:before': {
									borderBottomColor: borderColor,
									borderBottomWidth: '1px'
								},
								'& .MuiInput-underline:hover:not(.Mui-disabled):before': {
									borderBottomColor: textColor,
									borderBottomWidth: '1px'
								},
								'& .MuiInput-underline:after': {
									borderBottomColor: textColor,
									borderBottomWidth: '2px'
								},
								'& .MuiInputBase-root': {
									borderRadius: 0
								}
							}}
						/>
					</Grid>
				))}

				<Grid mt='1rem' size={{ xs: 12 }}>
					<Box
						display='flex'
						gap='1rem'
						alignItems='center'
						flexWrap='wrap'
						justifyContent={centerSubmit ? 'center' : 'flex-start'}
						flexDirection={centerSubmit ? 'column' : 'row'}
					>
						<Button
							type='submit'
							disabled={isSubmitting}
							sx={{
								width: solidSubmit ? '100%' : 'fit-content',
								backgroundColor: solidSubmit ? '#000000' : 'transparent',
								color: solidSubmit ? '#ffffff' : textColor,
								border: `1px solid ${textColor}`,
								padding: '0.6rem 1rem',
								fontSize: '12px',
								fontWeight: 500,
								textTransform: 'uppercase',
								letterSpacing: '2px',
								borderRadius: 0,
								transition: '0.3s',
								'&:hover': {
									backgroundColor: solidSubmit
										? 'transparent'
										: textColor,
									color: solidSubmit
										? textColor
										: isWhite
											? '#000000'
											: '#ffffff'
								},
								'&:disabled': {
									opacity: 0.5,
									cursor: 'not-allowed'
								}
							}}
						>
							{submitText}
						</Button>

						{customButton && (customButton.onClick || customButton.link) && (
							<Button
								type='button'
								onClick={customButton.onClick || (customButton.link ? () => window.open(customButton.link, '_blank') : undefined)}
								disabled={isSubmitting}
								sx={{
									width: 'fit-content',
									backgroundColor: customButton.black ? '#000000' : 'transparent',
									color: customButton.black ? '#ffffff' : textColor,
									border: `1px solid ${customButton.black ? '#000000' : textColor}`,
									padding: '0.6rem 1rem',
									fontSize: '12px',
									fontWeight: 500,
									textTransform: 'uppercase',
									letterSpacing: '2px',
									borderRadius: 0,
									transition: '0.3s',
									'&:hover': {
										backgroundColor: customButton.black ? '#000000' : textColor,
										color: customButton.black ? '#ffffff' : (isWhite ? '#000000' : '#ffffff')
									}
								}}
							>
								{customButton.text || 'Custom'}
							</Button>
						)}
					</Box>

					{submitStatus === 'success' && (
						<Typography
							variant='p'
							sx={{
								color: textColor,
								fontSize: '12px',
								textAlign: centerSubmit ? 'center' : 'left',
								width: '100%'
							}}
						>
							Thank you! Your submission was successful.
						</Typography>
					)}

					{submitStatus === 'phone_error' && (
						<Typography
							variant='p'
							sx={{
								color: '#d32f2f',
								fontSize: '12px',
								textAlign: centerSubmit ? 'center' : 'left',
								width: '100%'
							}}
						>
							Invalid phone number format. Please use a valid phone number
							(e.g., +1234567890).
						</Typography>
					)}

					{submitStatus === 'error' && (
						<Typography
							variant='p'
							sx={{
								color: '#d32f2f',
								fontSize: '12px',
								textAlign: centerSubmit ? 'center' : 'left',
								width: '100%'
							}}
						>
							Something went wrong. Please try again.
						</Typography>
					)}
				</Grid>
			</Grid>
		</form>
	)
}

export default KlaviyoForm
