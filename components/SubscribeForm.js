'use client'

// styles
import styles from './SubscribeForm.module.scss'

// components
import { Grid, TextField } from '@mui/material'

// formspree
import { useForm, ValidationError } from '@formspree/react'

const SubscribeForm = ({ isFooter }) => {
	const [state, handleSubmit] = useForm(process.env.NEXT_PUBLIC_FORMSPREE)

	const textColor = isFooter ? 'black' : 'white'
	const borderColor = isFooter ? 'rgba(0, 0, 0, 0.42)' : 'white'

	if (state.succeeded) {
		return <p>Thanks for joining!</p>
	}

	return (
		<form onSubmit={handleSubmit} className={styles.subscribeForm}>
			<Grid
				container
				rowSpacing='1rem'
				columnSpacing={{ xs: '1rem', lg: '2rem' }}
				maxWidth={'90vw'}
			>
				{/* Full Name */}
				{!isFooter && (
					<Grid size={{ xs: 6 }}>
						<TextField
							id='name'
							label='Full Name'
							name='name'
							variant='standard'
							sx={{
								width: '100%',
								'& .MuiInputBase-input': {
									fontSize: '14px',
									color: textColor
								},
								'& .MuiInputLabel-root': {
									fontSize: '14px',
									color: textColor
								},
								'& .MuiInput-underline:before': {
									borderBottomColor: borderColor
								},
								'& .MuiInput-underline:hover:not(.Mui-disabled):before': {
									borderBottomColor: textColor
								},
								'& .MuiInput-underline:after': {
									borderBottomColor: textColor
								}
							}}
						/>
						<ValidationError prefix='Name' field='name' errors={state.errors} />
					</Grid>
				)}

				{/* Email */}
				<Grid size={{ xs: isFooter ? 12 : 6 }}>
					<TextField
						id='email'
						label='Email'
						name='email'
						variant='standard'
						sx={{
							width: '100%',
							'& .MuiInputBase-input': {
								fontSize: '14px',
								color: textColor
							},
							'& .MuiInputLabel-root': {
								fontSize: '14px',
								color: textColor
							},
							'& .MuiInput-underline:before': {
								borderBottomColor: borderColor
							},
							'& .MuiInput-underline:hover:not(.Mui-disabled):before': {
								borderBottomColor: textColor
							},
							'& .MuiInput-underline:after': {
								borderBottomColor: textColor
							}
						}}
					/>
					<ValidationError prefix='Email' field='email' errors={state.errors} />
				</Grid>

				{/* Date of Birth */}
				{!isFooter && (
					<Grid size={{ xs: 6 }}>
						<TextField
							id='dob'
							label='Date of Birth'
							name='dob'
							variant='standard'
							sx={{
								width: '100%',
								'& .MuiInputBase-input': {
									fontSize: '14px',
									color: textColor
								},
								'& .MuiInputLabel-root': {
									fontSize: '14px',
									color: textColor
								},
								'& .MuiInput-underline:before': {
									borderBottomColor: borderColor
								},
								'& .MuiInput-underline:hover:not(.Mui-disabled):before': {
									borderBottomColor: textColor
								},
								'& .MuiInput-underline:after': {
									borderBottomColor: textColor
								}
							}}
						/>
						<ValidationError
							prefix='Date of Birth'
							field='dob'
							errors={state.errors}
						/>
					</Grid>
				)}

				{/* Phone */}
				{!isFooter && (
					<Grid size={{ xs: 6 }}>
						<TextField
							id='phone'
							label='Phone Number'
							name='phone'
							variant='standard'
							sx={{
								width: '100%',
								'& .MuiInputBase-input': {
									fontSize: '14px',
									color: textColor
								},
								'& .MuiInputLabel-root': {
									fontSize: '14px',
									color: textColor
								},
								'& .MuiInput-underline:before': {
									borderBottomColor: borderColor
								},
								'& .MuiInput-underline:hover:not(.Mui-disabled):before': {
									borderBottomColor: textColor
								},
								'& .MuiInput-underline:after': {
									borderBottomColor: textColor
								}
							}}
						/>
						<ValidationError
							prefix='Phone'
							field='phone'
							errors={state.errors}
						/>
					</Grid>
				)}

				<Grid size={{ xs: 6 }}>
					<button
						type='submit'
						disabled={state.submitting}
						style={{
							width: 'fit-content',
							backgroundColor: 'transparent',
							color: textColor,
							border: `1px solid ${textColor}`
						}}
					>
						Subscribe
					</button>
				</Grid>
			</Grid>
		</form>
	)
}

export default SubscribeForm
