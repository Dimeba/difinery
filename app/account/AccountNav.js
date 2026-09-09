'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import styles from './Account.module.scss'

const LINKS = [
	{ href: '/account', label: 'Overview' },
	{ href: '/account/orders', label: 'Orders' },
	{ href: '/account/wishlist', label: 'Wishlist' },
	{ href: '/account/addresses', label: 'Addresses' },
	{ href: '/account/profile', label: 'Profile' }
]

const AccountNav = ({ greeting }) => {
	const pathname = usePathname()

	const isActive = href =>
		href === '/account' ? pathname === '/account' : pathname.startsWith(href)

	return (
		<nav className={styles.nav}>
			{greeting && <p className={styles.navGreeting}>{greeting}</p>}

			{LINKS.map(link => (
				<Link
					key={link.href}
					href={link.href}
					className={`${styles.navLink} ${
						isActive(link.href) ? styles.navLinkActive : ''
					}`}
				>
					{link.label}
				</Link>
			))}

			{/* A form POST rather than a link so the browser never prefetches
			    the logout route and signs the customer out by accident. */}
			<form action='/api/account/logout' method='post'>
				<button type='submit' className={styles.signOut}>
					Sign out
				</button>
			</form>
		</nav>
	)
}

export default AccountNav
