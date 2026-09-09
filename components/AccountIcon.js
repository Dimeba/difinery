'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { FiUser } from 'react-icons/fi'

import { useAuth } from '@/context/AuthContext'
import styles from './Header.module.scss'

/**
 * Account entry point in the header, sitting next to the cart icon.
 *
 * Signed-in state only exists on the client (the pages are statically
 * rendered), so the link target is resolved after mount — same isMounted +
 * suppressHydrationWarning pattern the cart badge uses.
 */
const AccountIcon = ({ transparent = false, onNavigate }) => {
	const { isLoggedIn, loginHref } = useAuth()
	const pathname = usePathname()
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	const signedIn = isMounted && isLoggedIn
	const href = signedIn ? '/account' : loginHref(pathname)

	return (
		<Link
			href={href}
			className={styles.accountIcon}
			aria-label={signedIn ? 'Your account' : 'Sign in to your account'}
			onClick={onNavigate}
			suppressHydrationWarning
		>
			<Box className={styles.accountIconInner}>
				<FiUser
					size='1.2rem'
					stroke={transparent ? 'white' : 'black'}
					strokeWidth={1}
					suppressHydrationWarning
				/>
			</Box>
		</Link>
	)
}

export default AccountIcon
