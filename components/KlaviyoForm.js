'use client'

import { useState } from 'react'
import { Grid, TextField, Button, Box, Typography } from '@mui/material'

const KlaviyoForm = ({
	fields = [],
	submitText = 'Submit',
	customButton,
	columns = 1,
	contentColor = '#000000',
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
				setSubmitStatus('error')
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

	const borderColor = `${contentColor}42` // Add opacity
	const textColor = contentColor

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
							sx={{
								'& .MuiInputBase-input': {
									fontSize: '12px',
									color: '#000000',
									padding: '0.5rem 0'
								},
								'& .MuiInputBase-input::placeholder': {
									fontSize: '12px',
									color: 'rgba(0, 0, 0, 0.5)',
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
					<Box display='flex' gap='1rem' alignItems='center' flexWrap='wrap'>
						<Button
							type='submit'
							disabled={isSubmitting}
							sx={{
								width: 'fit-content',
								backgroundColor: 'transparent',
								color: textColor,
								border: `1px solid ${textColor}`,
								padding: '0.6rem 1rem',
								fontSize: '12px',
								fontWeight: 500,
								textTransform: 'uppercase',
								letterSpacing: '2px',
								borderRadius: 0,
								transition: '0.3s',
								'&:hover': {
									backgroundColor: textColor,
									color: contentColor === '#000000' ? '#ffffff' : '#000000'
								},
								'&:disabled': {
									opacity: 0.5,
									cursor: 'not-allowed'
								}
							}}
						>
							{submitText}
						</Button>

						{customButton && customButton.onClick && (
							<Button
								type='button'
								onClick={customButton.onClick}
								disabled={isSubmitting}
								sx={{
									width: 'fit-content',
									backgroundColor: 'transparent',
									color: textColor,
									border: `1px solid ${textColor}`,
									padding: '0.6rem 1rem',
									fontSize: '12px',
									fontWeight: 500,
									textTransform: 'uppercase',
									letterSpacing: '2px',
									borderRadius: 0,
									transition: '0.3s',
									'&:hover': {
										backgroundColor: textColor,
										color: contentColor === '#000000' ? '#ffffff' : '#000000'
									}
								}}
							>
								{customButton.text || 'Custom'}
							</Button>
						)}
					</Box>

					{submitStatus === 'success' && (
						<Typography variant='p' sx={{ color: textColor, fontSize: '12px' }}>
							Thank you! Your submission was successful.
						</Typography>
					)}

					{submitStatus === 'error' && (
						<Typography variant='p' sx={{ color: '#d32f2f', fontSize: '12px' }}>
							Something went wrong. Please try again.
						</Typography>
					)}
				</Grid>
			</Grid>
		</form>
	)
}

export default KlaviyoForm
