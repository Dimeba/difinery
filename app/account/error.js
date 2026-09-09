'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import styles from './Account.module.scss'

/**
 * Keeps a failing account page from showing a bare 500.
 *
 * Production builds strip the error message, but Next attaches a `digest` that
 * matches the full stack in the server logs (Netlify → Functions), so it is
 * shown here to make a report actionable.
 */
export default function AccountError({ error, reset }) {
	useEffect(() => {
		console.error('Account page error:', error)
	}, [error])

	return (
		<div className={styles.empty}>
			<p className={styles.pageTitle} style={{ marginBottom: '1rem' }}>
				We couldn&apos;t load your account
			</p>
			<p>
				Something went wrong on our side. Your account and orders are safe —
				please try again.
			</p>

			<div
				className={styles.formActions}
				style={{ justifyContent: 'center' }}
			>
				<button
					type='button'
					onClick={reset}
					className={`${styles.button} ${styles.buttonPrimary}`}
				>
					Try again
				</button>
				<Link href='/customer-service' className={styles.buttonSubtle}>
					Contact us
				</Link>
			</div>

			{error?.digest && (
				<p className={styles.muted} style={{ marginTop: '2rem' }}>
					Reference: {error.digest}
				</p>
			)}
		</div>
	)
}
