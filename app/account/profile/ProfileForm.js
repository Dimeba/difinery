'use client'

import { useActionState } from 'react'
import { TextField } from '@mui/material'

import { updateProfile } from '../actions'
import { inputSx } from '../inputSx'
import styles from '../Account.module.scss'

const initialState = { status: 'idle', message: '' }

const ProfileForm = ({ customer }) => {
	const [state, formAction, isPending] = useActionState(
		updateProfile,
		initialState
	)

	return (
		<form action={formAction}>
			<div className={styles.formGrid}>
				<TextField
					id='firstName'
					name='firstName'
					label='First name'
					variant='standard'
					defaultValue={customer?.firstName || ''}
					required
					sx={inputSx}
				/>
				<TextField
					id='lastName'
					name='lastName'
					label='Last name'
					variant='standard'
					defaultValue={customer?.lastName || ''}
					sx={inputSx}
				/>
			</div>

			<div className={styles.formActions}>
				<button
					type='submit'
					className={`${styles.button} ${styles.buttonPrimary}`}
					disabled={isPending}
				>
					{isPending ? 'Saving…' : 'Save changes'}
				</button>
			</div>

			{state.status === 'success' && (
				<p className={styles.feedbackSuccess}>{state.message}</p>
			)}
			{state.status === 'error' && (
				<p className={styles.feedbackError}>{state.message}</p>
			)}
		</form>
	)
}

export default ProfileForm
