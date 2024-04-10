'use client'

// styles
import styles from './Header.module.scss'

// components
import Link from 'next/link'
import Image from 'next/image'
import { FiShoppingBag, FiUser } from 'react-icons/fi'
import { Spin as Hamburger } from 'hamburger-react'

// hooks
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useIsScreenWide } from '@/hooks/useIsScreenWide'
import { useState } from 'react'

const Header = () => {
	const [targetRef, isIntersecting] = useIntersectionObserver()
	const isScreenWide = useIsScreenWide(1440)
	const [openMenu, setOpenMenu] = useState(false)

	// Menu Items
	const mainMenu = [
		'Shop',
		'Rings',
		'Earrings',
		'Bracelets',
		'Pendants',
		'Personalize',
		'Our Story',
		'Sale',
		'Education'
	]

	return (
		<header ref={targetRef}>
			<div className={styles.header}>
				<div className={`container ${styles.headerTop}`}>
					{isIntersecting && isScreenWide ? (
						<Link href='#' aria-label='#'>
							<p>Customer Support</p>
						</Link>
					) : (
						<div className={styles.hamburger}>
							<div>
								<Hamburger
									color='black'
									size={20}
									toggled={openMenu}
									toggle={setOpenMenu}
								/>
							</div>
						</div>
					)}

					<Link href='/' aria-label='Link to homepage.' className={styles.logo}>
						<Image
							src='/logo-black.svg'
							alt='Logo'
							width={120}
							height={160 / 8.6}
							style={{ objectFit: 'contain' }}
						/>
					</Link>

					<div className={styles.icons}>
						<Link href='/' aria-label='Link to homepage.'>
							<FiUser size={'1.2rem'} stroke='black' strokeWidth={1} />
						</Link>

						<Link href='/' aria-label='Link to homepage.'>
							<FiShoppingBag size={'1.2rem'} stroke='black' strokeWidth={1} />
						</Link>
					</div>
				</div>

				{(isIntersecting || openMenu) && (
					<nav className={`container ${styles.headerBot}`}>
						{mainMenu.map(link => (
							<Link
								key={link}
								href={link.replace(/ /g, '-').toLowerCase()}
								aria-label={`Link to ${link} page.`}
							>
								<p>{link}</p>
							</Link>
						))}
					</nav>
				)}
			</div>
		</header>
	)
}

export default Header
