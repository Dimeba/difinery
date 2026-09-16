'use client'

// styles
import styles from './Ubs.module.scss'

// components
import { TextField } from '@mui/material'
import Button from '../Button'

// lib
import { inputSx } from '@/app/account/inputSx'

const UbsActivate = () => {
	return (
		<section>
			<div className={`container ${styles.centered}`}>
				<h2>Activate Your Benefit</h2>
				<p className={styles.lead}>
					Enter your UBS email address to confirm eligibility.
					<br />
					Your ten percent discount will be applied automatically on every
					visit.
				</p>

				{/* Not wired up yet */}
				<form className={styles.form} onSubmit={e => e.preventDefault()}>
					<TextField
						id='ubs-email'
						name='email'
						type='email'
						label='Your UBS email address'
						variant='standard'
						autoComplete='email'
						sx={{
							...inputSx,
							'& .MuiInputLabel-root': {
								...inputSx['& .MuiInputLabel-root'],
								fontSize: '12px',
								letterSpacing: '1px'
							}
						}}
					/>
					<Button text='Confirm Eligibility' type='submit' fullWidth />
				</form>

				<p className={styles.note}>
					Eligibility is verified against a valid @ubs.com address. We do not
					share your information with UBS or any third party.
				</p>
			</div>
		</section>
	)
}

export default UbsActivate
