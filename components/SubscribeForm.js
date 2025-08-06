'use client'

// styles
import styles from './SubscribeForm.module.scss'

// components
import { Grid, TextField } from '@mui/material'

// formspree
import { useForm, ValidationError } from '@formspree/react'

const SubscribeForm = () => {
	const [state, handleSubmit] = useForm(process.env.NEXT_PUBLIC_FORMSPREE)
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
				<Grid size={{ xs: 6 }}>
					<TextField
						id='name'
						label='Full Name'
						name='name'
						variant='standard'
						sx={{
							width: '100%',
							'& .MuiInputBase-input': {
								fontSize: '14px'
							},
							'& .MuiInputLabel-root': {
								fontSize: '14px'
							}
						}}
					/>
					<ValidationError prefix='Name' field='name' errors={state.errors} />
				</Grid>

				{/* Email */}
				<Grid size={{ xs: 6 }}>
					<TextField
						id='email'
						label='Email'
						name='email'
						variant='standard'
						sx={{
							width: '100%',
							'& .MuiInputBase-input': {
								fontSize: '14px'
							},
							'& .MuiInputLabel-root': {
								fontSize: '14px'
							}
						}}
					/>
					<ValidationError prefix='Email' field='email' errors={state.errors} />
				</Grid>

				{/* Date of Birth */}
				<Grid size={{ xs: 6 }}>
					<TextField
						id='dob'
						label='Date of Birth'
						name='dob'
						variant='standard'
						sx={{
							width: '100%',
							'& .MuiInputBase-input': {
								fontSize: '14px'
							},
							'& .MuiInputLabel-root': {
								fontSize: '14px'
							}
						}}
					/>
					<ValidationError
						prefix='Date of Birth'
						field='dob'
						errors={state.errors}
					/>
				</Grid>

				{/* Phone */}
				<Grid size={{ xs: 6 }}>
					<TextField
						id='phone'
						label='Phone Number'
						name='phone'
						variant='standard'
						sx={{
							width: '100%',
							'& .MuiInputBase-input': {
								fontSize: '14px'
							},
							'& .MuiInputLabel-root': {
								fontSize: '14px'
							}
						}}
					/>
					<ValidationError prefix='Phone' field='phone' errors={state.errors} />
				</Grid>

				<Grid size={{ xs: 6 }}>
					<button type='submit' disabled={state.submitting}>
						Subscribe
					</button>
				</Grid>
			</Grid>
		</form>
	)
}

export default SubscribeForm
