'use client'

// styles
import styles from './Header.module.scss'

// components
import Link from 'next/link'
import Image from 'next/image'
import { FiShoppingBag, FiUser, FiArrowRight } from 'react-icons/fi'
import { Spin as Hamburger } from 'hamburger-react'

// hooks
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useIsScreenWide } from '@/hooks/useIsScreenWide'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const Header = () => {
	const [targetRef, isIntersecting] = useIntersectionObserver()
	const isScreenWide = useIsScreenWide(1024)
	const [openMenu, setOpenMenu] = useState(false)
	const [showSubmenu, setShowSubmenu] = useState(false)
	const pathName = usePathname()
	const isHomepage = pathName == '/' ? true : false
	const transparentMenu =
		isHomepage && isIntersecting && !showSubmenu && !openMenu

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

	// Submenu Items
	const tempList = [
		'Rings',
		'Earrings',
		'Bracelets',
		'Pendants',
		'Diamonds',
		'All'
	]

	const qucikLinks = ['Order Status', 'Returns', 'Gift Card']

	const occasion = ['Wedding', 'Engagement', 'Anniversary', 'Birthday']

	// Reseting open menu
	useEffect(() => {
		isIntersecting && setOpenMenu(false)
	}, [isIntersecting])

	// Show Submenu
	const loadSubmenu = () => {
		setShowSubmenu(true)
	}

	return (
		<header ref={targetRef}>
			<div
				className={`${styles.header} ${
					!isIntersecting ? styles.dropShadow : ''
				} ${transparentMenu ? styles.transparent : ''}`}
				onMouseLeave={() => setShowSubmenu(false)}
				onWheel={() => {
					setShowSubmenu(false)
					setOpenMenu(false)
				}}
			>
				<div className={`container ${styles.headerTop}`}>
					{isIntersecting && isScreenWide ? (
						<Link
							href='/customer-service'
							aria-label={`Link to Customer Service page.`}
						>
							<p>Customer Service</p>
						</Link>
					) : (
						<div
							className={styles.hamburger}
							onClick={() => setShowSubmenu(false)}
						>
							<div>
								<Hamburger
									color={transparentMenu ? 'white' : 'black'}
									size={20}
									toggled={openMenu}
									toggle={setOpenMenu}
								/>
							</div>
						</div>
					)}

					<Link href='/' aria-label='Link to homepage.' className={styles.logo}>
						<Image
							src={transparentMenu ? '/logo-white.svg' : '/logo-black.svg'}
							alt='Logo'
							width={120}
							height={120 / 7.5}
							style={{ objectFit: 'contain', objectPosition: 'center' }}
						/>
					</Link>

					<div className={styles.icons}>
						<Link href='/' aria-label='Link to homepage.'>
							<FiUser
								size={'1.2rem'}
								stroke={transparentMenu ? 'white' : 'black'}
								strokeWidth={1}
							/>
						</Link>

						<Link href='/' aria-label='Link to homepage.'>
							<FiShoppingBag
								size={'1.2rem'}
								stroke={transparentMenu ? 'white' : 'black'}
								strokeWidth={1}
							/>
						</Link>
					</div>
				</div>

				{((isIntersecting && isScreenWide) || openMenu) && (
					<nav className={`container ${styles.headerBot}`}>
						{mainMenu.map(link => (
							<Link
								key={link}
								href={'/' + link.replace(/ /g, '-').toLowerCase()}
								aria-label={`Link to ${link} page.`}
								className={styles.mainMenuLink}
								onMouseEnter={() => loadSubmenu()}
								onClick={() => setOpenMenu(false)}
							>
								<p>{link}</p>{' '}
								<FiArrowRight className={styles.mobileIcon} strokeWidth={1} />
							</Link>
						))}

						<Link
							href='/customer-service'
							aria-label={`Link to Customer Service page.`}
							className={`${styles.mainMenuLink} ${styles.mobileLink}`}
							onClick={() => setOpenMenu(false)}
						>
							<p>Customer Service</p>
							<FiArrowRight className={styles.mobileIcon} strokeWidth={1} />
						</Link>
					</nav>
				)}

				{showSubmenu && (
					<div className={`container ${styles.subMenu}`}>
						<div className={styles.column2}>
							{tempList.map(link => (
								<Link
									key={link}
									href={'/' + link.replace(/ /g, '-').toLowerCase()}
									aria-label={`Link to ${link} page.`}
									className={styles.subMenuLink}
								>
									<p>{link}</p>{' '}
								</Link>
							))}
						</div>

						<div className={styles.column2}>
							<p>Quick Links</p>
							{qucikLinks.map(link => (
								<Link
									key={link}
									href={'/' + link.replace(/ /g, '-').toLowerCase()}
									aria-label={`Link to ${link} page.`}
									className={styles.subMenuLink}
								>
									<p>{link}</p>{' '}
								</Link>
							))}
						</div>

						<div className={styles.column2}>
							<p>Shop by Occassion</p>
							{occasion.map(link => (
								<Link
									key={link}
									href={'/' + link.replace(/ /g, '-').toLowerCase()}
									aria-label={`Link to ${link} page.`}
									className={styles.subMenuLink}
								>
									<p>{link}</p>{' '}
								</Link>
							))}
						</div>

						<div className={styles.column3}>
							<Link href='#' alt='test'>
								<div className={styles.subMenuImg}>
									<Image src='/sample-image.jpg' alt='test' fill />
								</div>
							</Link>

							<p>Gift Card</p>
						</div>

						<div className={styles.column3}>
							<Link href='#' alt='test'>
								<div className={styles.subMenuImg}>
									<Image src='/sample-image.jpg' alt='test' fill />
								</div>
							</Link>

							<p>Gift Card</p>
						</div>
					</div>
				)}
			</div>
		</header>
	)
}

export default Header
