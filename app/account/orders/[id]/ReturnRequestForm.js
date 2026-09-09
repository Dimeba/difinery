'use client'

import { useActionState, useState } from 'react'

import { requestReturn } from '../../actions'
import styles from '../../Account.module.scss'

// Plain labels, not enum values — the reason is submitted as part of the
// customer note (see requestReturn in app/account/actions.js).
const REASONS = [
	'No longer wanted',
	'Too small',
	'Too large',
	'Not as described',
	'Wrong item received',
	'Damaged or defective',
	'Other'
]

const initialState = { status: 'idle', message: '' }

const ReturnRequestForm = ({ orderId, items }) => {
	const [state, formAction, isPending] = useActionState(
		requestReturn,
		initialState
	)
	const [open, setOpen] = useState(false)

	if (!items?.length) return null

	if (state.status === 'success') {
		return (
			<div className={styles.returnBox}>
				<p className={styles.sectionTitle} style={{ marginTop: 0 }}>
					Return requested
				</p>
				<p>{state.message}</p>
			</div>
		)
	}

	if (!open) {
		return (
			<div className={styles.formActions}>
				<button
					type='button'
					className={styles.button}
					onClick={() => setOpen(true)}
				>
					Request a return
				</button>
			</div>
		)
	}

	return (
		<form action={formAction} className={styles.returnBox}>
			<p className={styles.sectionTitle} style={{ marginTop: 0 }}>
				Request a return
			</p>

			<input type='hidden' name='orderId' value={orderId} />

			{items.map(item => (
				<label key={item.lineItem.id} className={styles.returnItem}>
					<input
						type='checkbox'
						name='lineItem'
						value={`${item.lineItem.id}:${item.quantity}`}
					/>
					<span>
						{item.lineItem.title}
						{item.lineItem.variantTitle ? ` — ${item.lineItem.variantTitle}` : ''}
						{item.quantity > 1 ? ` (×${item.quantity})` : ''}
					</span>
				</label>
			))}

			<div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
				<label className={styles.muted} htmlFor='returnReason'>
					Reason
				</label>
				<select
					id='returnReason'
					name='returnReason'
					defaultValue={REASONS[0]}
					style={{ padding: '0.6rem', border: '1px solid #d6d6d6', borderRadius: 0 }}
				>
					{REASONS.map(reason => (
						<option key={reason} value={reason}>
							{reason}
						</option>
					))}
				</select>

				<label className={styles.muted} htmlFor='customerNote'>
					Anything we should know? (optional)
				</label>
				<textarea
					id='customerNote'
					name='customerNote'
					rows={3}
					maxLength={300}
					style={{ padding: '0.6rem', border: '1px solid #d6d6d6', borderRadius: 0 }}
				/>
			</div>

			<div className={styles.formActions}>
				<button
					type='submit'
					className={`${styles.button} ${styles.buttonPrimary}`}
					disabled={isPending}
				>
					{isPending ? 'Sending…' : 'Submit request'}
				</button>
				<button
					type='button'
					className={styles.buttonSubtle}
					onClick={() => setOpen(false)}
				>
					Cancel
				</button>
			</div>

			{state.status === 'error' && (
				<p className={styles.feedbackError}>{state.message}</p>
			)}
		</form>
	)
}

export default ReturnRequestForm
