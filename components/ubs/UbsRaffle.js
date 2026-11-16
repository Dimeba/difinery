'use client'

// styles
import styles from './UbsRaffle.module.scss'

// components
import Image from 'next/image'
import { TextField } from '@/lib/mui'

// hooks
import { useState } from 'react'

// Netlify detects the form from public/__forms.html at deploy time; the
// submission is POSTed to that static file (same as ContactForm).
const FORM_ACTION = '/__forms.html'
const FORM_NAME = 'ubs-raffle'

const fieldSx = {
	width: '100%',
	'& .MuiInputBase-input': {
		// 16px keeps iOS Safari from zooming into the field on focus
		fontSize: '16px',
		color: 'black',
		padding: '0.75rem 1rem'
	},
	'& .MuiInputLabel-root': {
		left: '1rem',
		fontSize: '14px',
		fontWeight: 500,
		letterSpacing: '2px',
		textTransform: 'uppercase',
		color: '#8c8c8c'
	},
	// The required state is already conveyed by the browser; the design
	// shows no asterisk on the labels
	'& .MuiFormLabel-asterisk': {
		display: 'none'
	},
	'& .MuiInputLabel-root.Mui-focused': {
		color: '#8c8c8c'
	},
	'& .MuiInput-underline:before': {
		borderBottomColor: 'black'
	},
	'& .MuiInput-underline:hover:not(.Mui-disabled):before': {
		borderBottomColor: 'black'
	},
	'& .MuiInput-underline:after': {
		borderBottomColor: 'black'
	}
}

const UbsRaffle = () => {
	const [status, setStatus] = useState('idle')

	const handleSubmit = async e => {
		e.preventDefault()
		if (status === 'submitting') return

		setStatus('submitting')

		const formData = new FormData(e.currentTarget)

		try {
			const res = await fetch(FORM_ACTION, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams(formData).toString()
			})

			if (!res.ok) throw new Error(`Request failed: ${res.status}`)

			setStatus('success')
			window.scrollTo({ top: 0 })
		} catch {
			setStatus('error')
		}
	}

	const startNewEntry = () => {
		setStatus('idle')
		window.scrollTo({ top: 0 })
	}

	if (status === 'success') {
		return (
			<div className={styles.success}>
				<Image
					src='/ubs/raffle-check.svg'
					alt=''
					width={200}
					height={200}
					className={styles.check}
				/>

				<h4 className={styles.eyebrow}>Submitted</h4>
				<h1 className={styles.successTitle}>You&rsquo;re Entered!</h1>
				<p className={styles.successText}>
					Thank you and good luck. The winner of $500 in fine jewelry will be
					contacted by email.
				</p>

				<div className={styles.perk}>
					<h4 className={styles.eyebrow}>Your UBS Perk</h4>
					<h2 className={styles.perkTitle}>10% Off any Difinery Piece</h2>
					<p className={styles.perkText}>Combinable with the $500 prize.</p>
				</div>

				<p className={styles.handBack}>Please hand the tablet back to our team</p>

				<button
					type='button'
					className={styles.newEntry}
					onClick={startNewEntry}
				>
					Start a New Entry
				</button>
			</div>
		)
	}

	return (
		<>
			<div className={styles.hero}>
				<Image
					src='/ubs/raffle-hero.jpg'
					alt='Difinery gold engagement rings on travertine'
					fill
					priority
					sizes='100vw'
					className={styles.heroBackground}
				/>

				<Image
					src='/logo-white.svg'
					alt='Difinery'
					width={172}
					height={24}
					className={styles.logo}
				/>
				<h4 className={styles.heroEyebrow}>UBS Staff Exclusive</h4>

				<h1 className={styles.heroTitle}>
					<span className={styles.heroKicker}>Enter to Win</span>
					<span className={styles.heroAmount}>$500</span>
					<span className={styles.heroPrize}>in Fine Jewelry</span>
				</h1>

				<p className={styles.heroText}>
					Plus your exclusive UBS 10% discount, on top.
				</p>
			</div>

			<div className={styles.formWrap}>
				<form
					name={FORM_NAME}
					method='POST'
					action={FORM_ACTION}
					onSubmit={handleSubmit}
					className={styles.form}
				>
					<input type='hidden' name='form-name' value={FORM_NAME} />
					<p hidden>
						<label>
							Don&rsquo;t fill this out: <input name='bot-field' />
						</label>
					</p>

					<TextField
						id='raffle-name'
						name='name'
						label='Full Name'
						variant='standard'
						autoComplete='name'
						required
						sx={fieldSx}
					/>
					<TextField
						id='raffle-email'
						name='email'
						type='email'
						label='UBS Email'
						variant='standard'
						autoComplete='email'
						required
						sx={fieldSx}
					/>
					<TextField
						id='raffle-phone'
						name='phone'
						type='tel'
						label='Mobile Number (Optional)'
						variant='standard'
						autoComplete='tel'
						sx={fieldSx}
					/>

					<label className={styles.consent}>
						<input
							type='checkbox'
							name='consent'
							value='yes'
							required
							className={styles.checkbox}
						/>
						<span>
							I agree to receive marketing emails and promotional materials
							from DIFINERY.
							<br className={styles.desktopBreak} /> I understand I can
							unsubscribe at any time. *
						</span>
					</label>

					<button
						type='submit'
						className={styles.submit}
						disabled={status === 'submitting'}
					>
						{status === 'submitting' ? 'Submitting…' : 'Enter to Win'}
					</button>

					{status === 'error' && (
						<p className={styles.error} role='alert'>
							Sorry, something went wrong. Please try again.
						</p>
					)}

					<p className={styles.disclaimer}>
						One entry per person. The $500 prize can be combined with the UBS
						10% discount on any DIFINERY purchase. Must be present or reachable
						by email to claim.
					</p>
				</form>
			</div>
		</>
	)
}

export default UbsRaffle
