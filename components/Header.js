'use client'

// styles
import styles from './Header.module.scss'

// components
import { Box, ClickAwayListener, Typography } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { FiShoppingBag, FiUser, FiArrowRight } from 'react-icons/fi'
import { Spin as Hamburger } from 'hamburger-react'

// hooks
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useIsScreenWide } from '@/hooks/useIsScreenWide'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

// context
import { useCart } from '@/context/CartContext'

// data
import submenus from '@/data/submenus.json' with { type: 'json' }

const Header = ({ content }) => {
	// cart
	const { setShowCart } = useCart()

	// header
	const [targetRef, isIntersecting] = useIntersectionObserver()
	const isScreenWide = useIsScreenWide(1024)
	const [openMenu, setOpenMenu] = useState(false)
	const [showSubmenu, setShowSubmenu] = useState(false)
	const [activeSubmenu, setActiveSubmenu] = useState(null)
	const pathName = usePathname()

	// Check if the current path is homepage, about or education
	const isHomepage = pathName == '/' ? true : false
	const isAbout = pathName == '/our-story' ? true : false
	const isEducation = pathName == '/education' ? true : false
	const isBlankCanvas = pathName == '/blank-canvas' ? true : false

	const isTransparent = isHomepage || isAbout || isEducation || isBlankCanvas ? true : false

	const transparentMenu =
		isTransparent && isIntersecting && !showSubmenu && !openMenu

	// Submenu Items
	const categories = ['Rings', 'Earrings', 'Necklaces', 'Bracelets']

	// Show Submenu
	const loadSubmenu = submenu => {
		setActiveSubmenu(submenu)
		setShowSubmenu(true)
	}

	// Reseting open menu
	useEffect(() => {
		isIntersecting && setOpenMenu(false)
	}, [isIntersecting])	

	return (
		<ClickAwayListener
			onClickAway={() => {
				setShowSubmenu(false)
			}}
		>
			<Box ref={targetRef}>
				<Box
					sx={{
						position: 'fixed',
						top: 0,
						zIndex: 1000,
						width: '100%',
						backgroundColor: transparentMenu ? 'transparent' : 'white',
						'& *': {
							color: transparentMenu ? 'white' : ''
						},
						filter:
							!isIntersecting || showSubmenu
								? 'drop-shadow(0 0.25rem 2rem rgba(0, 0, 0, 0.1))'
								: 'none'
					}}
					onMouseLeave={() => setShowSubmenu(false)}
					onWheel={() => {
						setShowSubmenu(false)
						setOpenMenu(false)
					}}
					onClick={() => {
						setShowSubmenu(false)
					}}
				>
					{/* Support, Icons and Logo */}
					<Box
						className='container'
						display='flex'
						alignItems='center'
						justifyContent='space-between'
						padding='2rem 0'
						position='relative'
					>
						{isIntersecting && isScreenWide ? (
							<Link
								href={
									'/' +
									content.supportPage.fields.title
										.replace(/ /g, '-')
										.toLowerCase()
								}
								aria-label={`Link to Customer Service page.`}
							>
								<Typography
									variant='p'
									sx={{
										fontSize: '0.7rem',
										textTransform: 'uppercase',
										letterSpacing: '0.2em'
									}}
								>
									{content.supportPage.fields.title}
								</Typography>
							</Link>
						) : (
							<Box
								className={styles.hamburger}
								onClick={() => setShowSubmenu(false)}
							>
								<Box>
									<Hamburger
										color={transparentMenu ? 'white' : 'black'}
										size={20}
										toggled={openMenu}
										toggle={setOpenMenu}
									/>
								</Box>
							</Box>
						)}

						<Link
							href='/'
							aria-label='Link to homepage.'
							className={styles.logo}
						>
							<Image
								src={transparentMenu ? '/logo-white.svg' : '/logo-black.svg'}
								alt='Logo'
								width={150}
								height={150 / 7.5}
								style={{ objectFit: 'contain', objectPosition: 'center' }}
							/>
						</Link>

						<Box display='flex' alignItems='center' gap='1rem'>
							{/* <FiUser
							size={'1.2rem'}
							stroke={transparentMenu ? 'white' : 'black'}
							strokeWidth={1}
							cursor={'pointer'}
						/> */}

							<FiShoppingBag
								size={'1.2rem'}
								stroke={transparentMenu ? 'white' : 'black'}
								strokeWidth={1}
								onClick={() => setShowCart(true)}
								cursor={'pointer'}
							/>
						</Box>
					</Box>

					{/* Main Menu */}
					{((isIntersecting && isScreenWide) || openMenu) && (
						<nav className={`container ${styles.headerBot}`}>
							{/* Shop Page */}
							<Link
								href='/shop'
								aria-label='Link to Shop page.'
								className={styles.mainMenuLink}
								onMouseEnter={() => loadSubmenu(submenus[0].columns)}
								onClick={() => setOpenMenu(false)}
							>
								<p>Shop</p>{' '}
								<FiArrowRight className={styles.mobileIcon} strokeWidth={1} />
							</Link>

							{/* Categories */}
							{categories.map((title, index) => (
								<Link
									key={index}
									href={`/shop/${title.toLowerCase()}`}
									aria-label={`Link to ${title} page.`}
									className={styles.mainMenuLink}
									onMouseEnter={() => loadSubmenu(submenus[index + 1].columns)}
									onClick={() => setOpenMenu(false)}
								>
									<p>{title}</p>{' '}
									<FiArrowRight className={styles.mobileIcon} strokeWidth={1} />
								</Link>
							))}

							{/* Gift Card */}
							<Link
								href='/shop/gift-card'
								aria-label={`Link to Gift Card page.`}
								className={`${styles.mainMenuUnderLink} ${styles.mobileLink}`}
								onClick={() => setOpenMenu(false)}
							>
								<p>Gift Card</p>
								
							</Link>

							{/* Contentful */}
							{content.mainMenu.map(link => (
								<Link
									key={link.sys.id}
									href={
										'/' + link.fields.title.replace(/ /g, '-').toLowerCase()
									}
									aria-label={`Link to ${link.fields.title} page.`}
									className={styles.mainMenuUnderLink}
									onClick={() => setOpenMenu(false)}
								>
									<p>{link.fields.title}</p>{' '}
									
								</Link>
							))}

							<Link
								href='/customer-service'
								aria-label={`Link to Customer Service page.`}
								className={`${styles.mainMenuUnderLink} ${styles.mobileLink}`}
								onClick={() => setOpenMenu(false)}
							>
								<p>Customer Service</p>

							</Link>
						</nav>
					)}

					{/* Submenu */}
					{content.showDropdownMenu && showSubmenu && (
						<div className={`container ${styles.subMenu}`}>
							{activeSubmenu &&
							activeSubmenu.map(column => {
								if (column.title === 'none') {
									return <div className={styles.column2} key={column.title} />
								}
								return (
									<div className={styles.column2} key={column.title}>
										<p style={{ fontWeight: '600' }}>{column.title}</p>
										{column.rows.map(row => (
											<Link
												key={row.title}
												href={row.url}
												aria-label={`Link to ${row.title} page.`}
												className={styles.subMenuLink}
											>
												<p>{row.title}</p>
											</Link>
										))}
									</div>
								)
							})}

							{content.promotions &&
								content.promotions.map(promo => (
									<div key={promo.sys.id} className={styles.column3}>
										<Link href={promo.fields.link} alt='test'>
											<div className={styles.subMenuImg}>
												<Image
													src={'https:' + promo.fields.image.fields.file.url}
													style={{ objectFit: 'cover' }}
													alt='test'
													fill
												/>
											</div>
										</Link>

										<p>{promo.fields.title}</p>
									</div>
								))}
						</div>
					)}
				</Box>
			</Box>
		</ClickAwayListener>
	)
}

export default Header
