'use client'

// styles
import styles from './Ubs.module.scss'

// components
import { TextField } from '@mui/material'
import Button from '../Button'

// hooks
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

// lib
import { inputSx } from '@/app/account/inputSx'

const ERRORS = {
	'invalid-email': 'Please enter a valid email address.',
	domain: 'Please use your @ubs.com email address.',
	default: 'Something went wrong. Please try again.'
}

const UbsActivate = () => {
	const { isLoggedIn, customer, loading } = useAuth()
	const [email, setEmail] = useState('')
	const [error, setError] = useState('')
	const [submitting, setSubmitting] = useState(false)

	// While the session is loading, keep showing the form so the layout does
	// not jump for signed-out visitors (the common case).
	const signedIn = !loading && isLoggedIn && customer
	const isEligible = signedIn && customer.ubsEligible

	const handleSubmit = async e => {
		e.preventDefault()
		if (submitting) return

		setError('')
		setSubmitting(true)

		try {
			const res = await fetch('/api/ubs/activate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			})
			const data = await res.json()

			if (!res.ok || !data.loginUrl) {
				setError(ERRORS[data.error] || ERRORS.default)
				setSubmitting(false)
				return
			}

			// Shopify sends a one-time code to the address, which is what
			// actually proves the visitor owns it. Stays in "submitting" state
			// while the browser navigates away.
			window.location.assign(data.loginUrl)
		} catch {
			setError(ERRORS.default)
			setSubmitting(false)
		}
	}

	if (isEligible) {
		return (
			<section id='activate-benefit'>
				<div className={`container ${styles.centered}`}>
					<h2>Your Benefit Is Active</h2>
					<p className={styles.lead}>
						You are signed in as {customer.email}.
						<br />
						Your ten percent UBS discount is applied automatically in your cart
						and at checkout.
					</p>

					<div className={styles.buttonWide}>
						<Button text='Shop Now' link='/shop' fullWidth />
					</div>
				</div>
			</section>
		)
	}

	if (signedIn) {
		return (
			<section id='activate-benefit'>
				<div className={`container ${styles.centered}`}>
					<h2>Activate Your Benefit</h2>
					<p className={styles.lead}>
						You are signed in as {customer.email}, which is not a UBS address.
						<br />
						Sign out and confirm eligibility with your UBS email address.
					</p>

					{/* A form POST rather than a link so the browser never prefetches
					    the logout route (same as AccountNav). */}
					<form
						action='/api/account/logout'
						method='post'
						className={styles.buttonWide}
					>
						<Button text='Sign Out' type='submit' fullWidth />
					</form>
				</div>
			</section>
		)
	}

	return (
		<section id='activate-benefit'>
			<div className={`container ${styles.centered}`}>
				<h2>Activate Your Benefit</h2>
				<p className={styles.lead}>
					Enter your UBS email address to confirm eligibility.
					<br />
					Your ten percent discount will be applied automatically on every
					visit.
				</p>

				<form className={styles.form} onSubmit={handleSubmit} noValidate>
					<TextField
						id='ubs-email'
						name='email'
						type='email'
						label='Your UBS email address'
						variant='standard'
						autoComplete='email'
						required
						value={email}
						onChange={e => {
							setEmail(e.target.value)
							if (error) setError('')
						}}
						error={Boolean(error)}
						helperText={error || ' '}
						sx={{
							...inputSx,
							'& .MuiInputLabel-root': {
								...inputSx['& .MuiInputLabel-root'],
								fontSize: '12px',
								letterSpacing: '1px'
							},
							'& .MuiFormHelperText-root': {
								textAlign: 'center',
								fontSize: '11px',
								marginTop: '0.5rem'
							}
						}}
					/>
					<Button
						text={submitting ? 'Confirming…' : 'Confirm Eligibility'}
						type='submit'
						disabled={submitting}
						fullWidth
					/>
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
