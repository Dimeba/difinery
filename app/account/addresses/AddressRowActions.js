'use client'

import { useActionState } from 'react'

import { deleteAddress, setDefaultAddress } from '../actions'
import styles from '../Account.module.scss'

const initialState = { status: 'idle', message: '' }

const AddressRowActions = ({ addressId, isDefault, onEdit }) => {
	const [deleteState, deleteAction, deleting] = useActionState(
		deleteAddress,
		initialState
	)
	const [defaultState, defaultAction, promoting] = useActionState(
		setDefaultAddress,
		initialState
	)

	const error =
		deleteState.status === 'error'
			? deleteState.message
			: defaultState.status === 'error'
				? defaultState.message
				: null

	return (
		<>
			<div className={styles.addressActions}>
				<button type='button' className={styles.buttonSubtle} onClick={onEdit}>
					Edit
				</button>

				{!isDefault && (
					<form action={defaultAction}>
						<input type='hidden' name='addressId' value={addressId} />
						<button
							type='submit'
							className={styles.buttonSubtle}
							disabled={promoting}
						>
							{promoting ? 'Saving…' : 'Set as default'}
						</button>
					</form>
				)}

				<form action={deleteAction}>
					<input type='hidden' name='addressId' value={addressId} />
					<button
						type='submit'
						className={styles.buttonDanger}
						disabled={deleting}
					>
						{deleting ? 'Removing…' : 'Remove'}
					</button>
				</form>
			</div>

			{error && <p className={styles.feedbackError}>{error}</p>}
		</>
	)
}

export default AddressRowActions
