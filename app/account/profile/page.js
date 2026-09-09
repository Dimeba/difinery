import { customerFetch } from '@/lib/customerAccount/client'
import { CUSTOMER_OVERVIEW } from '@/lib/customerAccount/queries'

import ProfileForm from './ProfileForm'
import styles from '../Account.module.scss'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
	const data = await customerFetch(CUSTOMER_OVERVIEW)
	const customer = data?.customer

	return (
		<>
			<h1 className={styles.pageTitle}>Profile</h1>
			<p className={styles.pageIntro}>
				Your email and phone number are managed by Shopify and can be changed
				when you sign in.
			</p>

			<ProfileForm customer={customer} />

			<h2 className={styles.sectionTitle}>Sign-in details</h2>
			<div className={styles.card}>
				<p className={styles.cardLabel}>Email</p>
				<p>{customer?.emailAddress?.emailAddress || '—'}</p>
				{customer?.phoneNumber?.phoneNumber && (
					<>
						<p className={styles.cardLabel} style={{ marginTop: '1.25rem' }}>
							Phone
						</p>
						<p>{customer.phoneNumber.phoneNumber}</p>
					</>
				)}
			</div>
		</>
	)
}
