'use client'

import styles from './ContactForm.module.scss'

import { Box, Grid, TextField, Typography } from '@mui/material'
import { useMemo, useState } from 'react'

const FORM_ACTION = '/__forms.html'

const ContactForm = ({ formName = 'contact' }) => {
	const [status, setStatus] = useState({ state: 'idle', message: '' })

	const inputSx = useMemo(
		() => ({
			width: '100%',
			'& .MuiInputBase-input': {
				fontSize: '14px',
				color: 'black'
			},
			'& .MuiInputLabel-root': {
				fontSize: '14px',
				color: 'black'
			},
			'& .MuiInput-underline:before': {
				borderBottomColor: 'rgba(0, 0, 0, 0.42)'
			},
			'& .MuiInput-underline:hover:not(.Mui-disabled):before': {
				borderBottomColor: 'black'
			},
			'& .MuiInput-underline:after': {
				borderBottomColor: 'black'
			}
		}),
		[]
	)

	const onSubmit = async e => {
		e.preventDefault()

		setStatus({ state: 'submitting', message: '' })

		const form = e.currentTarget
		const formData = new FormData(form)

		try {
			const res = await fetch(FORM_ACTION, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams(formData).toString()
			})

			if (!res.ok) {
				throw new Error(`Request failed: ${res.status}`)
			}

			form.reset()
			setStatus({ state: 'success', message: 'Thanks — we’ll get back to you soon.' })
		} catch (err) {
			setStatus({
				state: 'error',
				message: 'Sorry, something went wrong. Please try again.'
			})
		}
	}

	if (status.state === 'success') {
		return (
			<section className={styles.section}>
				<div className='container'>
					<Typography variant='h4' fontWeight={500} textAlign='center'>
						Send Us a Message
					</Typography>
					<Box marginTop='1.5rem' textAlign='center'>
						<p>{status.message}</p>
					</Box>
				</div>
			</section>
		)
	}

	return (
		<section className={styles.section}>
			<div className='container'>
				<div className={styles.content}>
					<div className={styles.header}>
						<Typography variant='h4' fontWeight={500}>
							Send Us a Message
						</Typography>
						<Box marginTop='1.5rem'>
							<p>
								We’ll get back to you as soon as possible. We're committed to
								making your experience smooth, clear, and meaningful.
							</p>
						</Box>
					</div>

					<div className={styles.formWrap}>
						<form
							name={formName}
							method='POST'
							action={FORM_ACTION}
							onSubmit={onSubmit}
							className={styles.form}
						>
							<input type='hidden' name='form-name' value={formName} />
							<p style={{ display: 'none' }}>
								<label>
									Don’t fill this out:{' '}
									<input name='bot-field' />
								</label>
							</p>

							<Grid
								container
								rowSpacing='1rem'
								columnSpacing={{ xs: '1rem', lg: '2rem' }}
								maxWidth={'90vw'}
							>
								<Grid size={{ xs: 12, md: 6 }}>
									<TextField
										id='name'
										label='Full Name'
										name='name'
										variant='standard'
										required
										sx={inputSx}
									/>
								</Grid>

								<Grid size={{ xs: 12, md: 6 }}>
									<TextField
										id='email'
										label='Email'
										name='email'
										type='email'
										variant='standard'
										required
										sx={inputSx}
									/>
								</Grid>

								<Grid size={{ xs: 12 }}>
									<TextField
										id='subject'
										label='Subject'
										name='subject'
										variant='standard'
										sx={inputSx}
									/>
								</Grid>

								<Grid size={{ xs: 12 }}>
									<TextField
										id='message'
										label='Message'
										name='message'
										variant='standard'
										multiline
										minRows={4}
										required
										sx={inputSx}
									/>
								</Grid>

								<Grid size={{ xs: 12 }} className={styles.actions}>
									<button
										type='submit'
										disabled={status.state === 'submitting'}
										className={styles.submit}
									>
										{status.state === 'submitting' ? 'Sending…' : 'Send message'}
									</button>
								</Grid>
							</Grid>

							{status.state === 'error' && (
								<p className={styles.error}>{status.message}</p>
							)}
						</form>
					</div>
				</div>
			</div>
		</section>
	)
}

export default ContactForm

