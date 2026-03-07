'use client'

// styles
import styles from './Header.module.scss'

// components
import { Box, ClickAwayListener, Typography } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import HeaderSubmenu from './HeaderSubmenu'
import {
	FiShoppingBag,
	FiUser,
	FiArrowRight,
	FiArrowDown,
	FiArrowUp
} from 'react-icons/fi'
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
import engagmentSubmenu from '@/data/engagmentSubmenu.json' with { type: 'json' }

const Header = ({
	content,
	collectionsContent,
	engagementSubmenuColumns = engagmentSubmenu.columns || [],
	engagementPromoOverrides = engagmentSubmenu.promotions || []
}) => {
	// cart
	const { setShowCart, cart } = useCart()

	// Track if component has mounted to prevent hydration mismatch
	const [isMounted, setIsMounted] = useState(false)

	// Calculate total number of items in cart
	const cartItemCount =
		cart?.lines?.edges?.reduce((total, { node }) => {
			return total + (node.quantity || 0)
		}, 0) || 0

	// header
	const [targetRef, isIntersecting] = useIntersectionObserver()
	const isScreenWide = useIsScreenWide(1024)
	const [openMenu, setOpenMenu] = useState(false)
	const [showSubmenu, setShowSubmenu] = useState(false)
	const [activeSubmenu, setActiveSubmenu] = useState(null)
	const [showCollections, setShowCollections] = useState(false)
	const pathName = usePathname()

	// Set mounted state after hydration
	useEffect(() => {
		setIsMounted(true)
	}, [])

	// Check if the current path is homepage, about or education
	const isHomepage = pathName == '/' ? true : false
	const isAbout = pathName == '/our-story' ? true : false
	const isEducation = pathName == '/education' ? true : false
	const isBlankCanvas = pathName == '/blank-canvas' ? true : false
	const isRecycledGold = pathName == '/recycled-gold' ? true : false
	const isLabGrown = pathName == '/lab-grown-diamonds' ? true : false

	const isTransparent =
		isHomepage ||
		isAbout ||
		isEducation ||
		isBlankCanvas ||
		isRecycledGold ||
		isLabGrown
			? true
			: false

	// Initialize isIntersecting as true for transparent pages to avoid flash
	// This assumes the page starts at the top, which is usually the case
	const [initialIntersecting] = useState(isTransparent)
	const effectiveIntersecting = isMounted ? isIntersecting : initialIntersecting

	const transparentMenu =
		isTransparent && effectiveIntersecting && !showSubmenu && !openMenu

	// Submenu Items
	const categories = ['Rings', 'Earrings', 'Necklaces', 'Bracelets']

	// Show Submenu
	const loadSubmenu = submenuConfig => {
		setActiveSubmenu(submenuConfig)
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
			<Box ref={targetRef} suppressHydrationWarning>
				<Box
					suppressHydrationWarning
					className={
						isTransparent && !isMounted ? styles.initialTransparent : ''
					}
					sx={{
						position: 'fixed',
						top: 0,
						zIndex: 1000,
						width: '100%',
						backgroundColor: transparentMenu ? 'transparent' : 'white',
						'& *': {
							color: transparentMenu ? 'white' : '',
							transition: 'color 0.2s ease'
						},
						filter:
							!effectiveIntersecting || showSubmenu
								? 'drop-shadow(0 0.25rem 2rem rgba(0, 0, 0, 0.1))'
								: 'none',
						transition: 'background-color 0.2s ease, filter 0.2s ease'
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
						suppressHydrationWarning
					>
						<Box suppressHydrationWarning>
							{effectiveIntersecting && isScreenWide ? (
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
						</Box>

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
								suppressHydrationWarning
							/>
						</Link>

						<Box display='flex' alignItems='center' gap='1rem'>
							{/* <FiUser
							size={'1.2rem'}
							stroke={transparentMenu ? 'white' : 'black'}
							strokeWidth={1}
							cursor={'pointer'}
						/> */}

							<Box
								position='relative'
								sx={{ cursor: 'pointer' }}
								onClick={() => setShowCart(true)}
							>
								<FiShoppingBag
									size={'1.2rem'}
									stroke={transparentMenu ? 'white' : 'black'}
									strokeWidth={1}
								/>
								{isMounted && cartItemCount > 0 && (
									<Box
										sx={{
											position: 'absolute',
											top: '-8px',
											right: '-8px',
											backgroundColor: '#dc2626',
											color: 'white',
											borderRadius: '50%',
											width: '18px',
											height: '18px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center'
										}}
									>
										<Typography
											color='white'
											sx={{
												fontSize: '10px',
												fontWeight: '600',
												width: '100%',
												textAlign: 'center'
											}}
										>
											{cartItemCount > 99 ? '99+' : cartItemCount}
										</Typography>
									</Box>
								)}
							</Box>
						</Box>
					</Box>

					{/* Main Menu */}
					<Box suppressHydrationWarning>
						{((effectiveIntersecting && isScreenWide) || openMenu) && (
							<nav className={`container ${styles.headerBot}`}>
								{/* Shop Page */}
								<Link
									href='/shop/all/yellow-gold/all'
									aria-label='Link to Shop page.'
									className={styles.mainMenuLink}
									onMouseEnter={() =>
										loadSubmenu({ columns: submenus[0].columns })
									}
									onClick={() => setOpenMenu(false)}
								>
									<p>Shop</p>{' '}
									<FiArrowRight className={styles.mobileIcon} strokeWidth={1} />
								</Link>

								{/* Engagement Rings */}
								<Link
									href={engagmentSubmenu.link || '/shop/collections/engagement-rings'}
									aria-label='Link to Engagement Rings collection.'
									className={styles.mainMenuLink}
									onMouseEnter={() =>
										loadSubmenu({
											columns: engagementSubmenuColumns,
											promoOverrides: engagementPromoOverrides
										})
									}
									onClick={() => setOpenMenu(false)}
								>
									<p>Engagement</p>{' '}
									<FiArrowRight className={styles.mobileIcon} strokeWidth={1} />
								</Link>

								{/* Categories */}
								{categories.map((title, index) => (
									<Link
										key={index}
										href={`/shop/${title.toLowerCase()}`}
										aria-label={`Link to ${title} page.`}
										className={styles.mainMenuLink}
										onMouseEnter={() =>
											loadSubmenu({ columns: submenus[index + 1].columns })
										}
										onClick={() => setOpenMenu(false)}
									>
										<p>{title}</p>{' '}
										<FiArrowRight
											className={styles.mobileIcon}
											strokeWidth={1}
										/>
									</Link>
								))}

								{/* Collections */}
								{!isScreenWide && (
									<Box
										display='flex'
										flexDirection='column'
										gap='1rem'
										className={styles.mainMenuLink}
										onClick={() => setShowCollections(!showCollections)}
									>
										<Box
											display='flex'
											alignItems='center'
											justifyContent='space-between'
											width='100%'
										>
											<p>Collections</p>
											{showCollections ? (
												<FiArrowUp
													className={styles.mobileIcon}
													strokeWidth={1}
												/>
											) : (
												<FiArrowDown
													className={styles.mobileIcon}
													strokeWidth={1}
												/>
											)}
										</Box>

										{showCollections && (
											<Box display='flex' flexDirection='column' gap='0.5rem'>
												{collectionsContent.map(collection => (
													<Link
														key={collection.sys.id}
														href={`/shop/collections/${collection.fields.title
															.toLowerCase()
															.replace(/[^a-zA-Z0-9 ]/g, '')
															.replace(/&/g, '')
															.replace(/ /g, '-')}`}
														aria-label={`Link to ${collection.fields.title} collection.`}
														className={styles.mainMenuUnderLink}
														onClick={() => setOpenMenu(false)}
													>
														<p>{collection.fields.title}</p>
													</Link>
												))}
											</Box>
										)}
									</Box>
								)}

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
					</Box>

					{/* Submenu */}
					{content.showDropdownMenu && showSubmenu && (
						<HeaderSubmenu
							columns={activeSubmenu?.columns || []}
							promotions={content.promotions || []}
							promoOverrides={activeSubmenu?.promoOverrides || []}
						/>
					)}
				</Box>
			</Box>
		</ClickAwayListener>
	)
}

export default Header
