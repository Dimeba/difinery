'use client'

import { useState } from 'react'

import AddressForm from './AddressForm'
import AddressRowActions from './AddressRowActions'
import styles from '../Account.module.scss'

// `editing` holds either 'new' or an address id, so only one panel is open.
const AddressBook = ({ addresses, defaultAddressId }) => {
	const [editing, setEditing] = useState(null)
	const close = () => setEditing(null)

	return (
		<>
			{editing === 'new' ? (
				<AddressForm isDefault={addresses.length === 0} onDone={close} />
			) : (
				<div className={styles.formActions} style={{ marginTop: 0 }}>
					<button
						type='button'
						className={`${styles.button} ${styles.buttonPrimary}`}
						onClick={() => setEditing('new')}
					>
						Add an address
					</button>
				</div>
			)}

			{addresses.length === 0 ? (
				<div className={styles.empty} style={{ marginTop: '2rem' }}>
					<p>You haven&apos;t saved an address yet.</p>
				</div>
			) : (
				<div className={styles.addressGrid} style={{ marginTop: '2.5rem' }}>
					{addresses.map(address => {
						const isDefault = address.id === defaultAddressId

						if (editing === address.id) {
							return (
								<div key={address.id} className={styles.formFull}>
									<AddressForm
										address={address}
										isDefault={isDefault}
										onDone={close}
									/>
								</div>
							)
						}

						return (
							<div
								key={address.id}
								className={`${styles.addressCard} ${
									isDefault ? styles.addressCardDefault : ''
								}`}
							>
								{isDefault && <p className={styles.cardLabel}>Default</p>}

								<p className={styles.addressLines}>
									{address.formatted?.join('\n')}
								</p>

								<AddressRowActions
									addressId={address.id}
									isDefault={isDefault}
									onEdit={() => setEditing(address.id)}
								/>
							</div>
						)
					})}
				</div>
			)}
		</>
	)
}

export default AddressBook
