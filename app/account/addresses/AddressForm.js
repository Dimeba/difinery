'use client'

import { useActionState } from 'react'
import { TextField } from '@mui/material'

import { createAddress, updateAddress } from '../actions'
import { inputSx } from '../inputSx'
import styles from '../Account.module.scss'

const initialState = { status: 'idle', message: '' }

/**
 * Add or edit form. `address` present ⇒ edit mode.
 * Shopify wants ISO codes: territoryCode "US", zoneCode "NY".
 */
const AddressForm = ({ address, isDefault, onDone }) => {
	const editing = Boolean(address?.id)
	const [state, formAction, isPending] = useActionState(
		editing ? updateAddress : createAddress,
		initialState
	)

	if (state.status === 'success') {
		return (
			<div className={styles.returnBox}>
				<p>{state.message}</p>
				<div className={styles.formActions}>
					<button type='button' className={styles.button} onClick={onDone}>
						Done
					</button>
				</div>
			</div>
		)
	}

	return (
		<form action={formAction} className={styles.returnBox}>
			<p className={styles.sectionTitle} style={{ marginTop: 0 }}>
				{editing ? 'Edit address' : 'Add an address'}
			</p>

			{editing && <input type='hidden' name='addressId' value={address.id} />}

			<div className={styles.formGrid}>
				<TextField
					name='firstName'
					label='First name'
					variant='standard'
					defaultValue={address?.firstName || ''}
					sx={inputSx}
				/>
				<TextField
					name='lastName'
					label='Last name'
					variant='standard'
					defaultValue={address?.lastName || ''}
					sx={inputSx}
				/>
				<TextField
					name='company'
					label='Company (optional)'
					variant='standard'
					defaultValue={address?.company || ''}
					sx={inputSx}
					className={styles.formFull}
				/>
				<TextField
					name='address1'
					label='Address'
					variant='standard'
					defaultValue={address?.address1 || ''}
					required
					sx={inputSx}
					className={styles.formFull}
				/>
				<TextField
					name='address2'
					label='Apartment, suite, etc. (optional)'
					variant='standard'
					defaultValue={address?.address2 || ''}
					sx={inputSx}
					className={styles.formFull}
				/>
				<TextField
					name='city'
					label='City'
					variant='standard'
					defaultValue={address?.city || ''}
					required
					sx={inputSx}
				/>
				<TextField
					name='zoneCode'
					label='State / province code (e.g. NY)'
					variant='standard'
					defaultValue={address?.zoneCode || ''}
					sx={inputSx}
				/>
				<TextField
					name='zip'
					label='ZIP / postal code'
					variant='standard'
					defaultValue={address?.zip || ''}
					sx={inputSx}
				/>
				<TextField
					name='territoryCode'
					label='Country code (e.g. US)'
					variant='standard'
					defaultValue={address?.territoryCode || 'US'}
					required
					sx={inputSx}
				/>
				<TextField
					name='phoneNumber'
					label='Phone (optional)'
					variant='standard'
					defaultValue={address?.phoneNumber || ''}
					sx={inputSx}
					className={styles.formFull}
				/>
			</div>

			<label className={styles.checkboxRow} style={{ marginTop: '1.5rem' }}>
				<input
					type='checkbox'
					name='defaultAddress'
					defaultChecked={isDefault}
				/>
				Use as my default address
			</label>

			<div className={styles.formActions}>
				<button
					type='submit'
					className={`${styles.button} ${styles.buttonPrimary}`}
					disabled={isPending}
				>
					{isPending ? 'Saving…' : editing ? 'Save address' : 'Add address'}
				</button>
				<button type='button' className={styles.buttonSubtle} onClick={onDone}>
					Cancel
				</button>
			</div>

			{state.status === 'error' && (
				<p className={styles.feedbackError}>{state.message}</p>
			)}
		</form>
	)
}

export default AddressForm
