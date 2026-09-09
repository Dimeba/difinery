import { customerFetch } from '@/lib/customerAccount/client'
import { CUSTOMER_ADDRESSES } from '@/lib/customerAccount/queries'

import AddressBook from './AddressBook'
import styles from '../Account.module.scss'

export const dynamic = 'force-dynamic'

export default async function AddressesPage() {
	const data = await customerFetch(CUSTOMER_ADDRESSES)
	const customer = data?.customer

	return (
		<>
			<h1 className={styles.pageTitle}>Addresses</h1>
			<p className={styles.pageIntro}>
				Saved addresses are offered at checkout.
			</p>

			<AddressBook
				addresses={customer?.addresses?.nodes || []}
				defaultAddressId={customer?.defaultAddress?.id || null}
			/>
		</>
	)
}
