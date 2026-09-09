import { redirect } from 'next/navigation'

import { customerFetch, UnauthorizedError } from '@/lib/customerAccount/client'
import { CUSTOMER_ME } from '@/lib/customerAccount/queries'

import AccountNav from './AccountNav'
import styles from './Account.module.scss'

// Every account page is per-customer. The rest of the site is statically
// generated, so these routes opt out explicitly.
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
	title: 'My Account | Difinery',
	robots: { index: false, follow: false }
}

export default async function AccountLayout({ children }) {
	let customer = null

	try {
		const data = await customerFetch(CUSTOMER_ME)
		customer = data?.customer || null
	} catch (error) {
		// proxy.js normally refreshes the session before we get here; this is
		// the backstop for a token revoked mid-session.
		if (error instanceof UnauthorizedError) redirect('/api/account/login')
		throw error
	}

	const greeting = customer?.firstName
		? `Hello, ${customer.firstName}`
		: 'Your account'

	return (
		<main className={`container topSection ${styles.shell}`}>
			<AccountNav greeting={greeting} />
			<div className={styles.content}>{children}</div>
		</main>
	)
}
