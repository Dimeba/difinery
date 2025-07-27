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

const Header = ({ content }) => {
	// cart
	const { setShowCart } = useCart()

	// header
	const [targetRef, isIntersecting] = useIntersectionObserver()
	const isScreenWide = useIsScreenWide(1024)
	const [openMenu, setOpenMenu] = useState(false)
	const [showSubmenu, setShowSubmenu] = useState(false)
	const pathName = usePathname()

	// Check if the current path is homepage, about or education
	const isHomepage = pathName == '/' ? true : false
	const isAbout = pathName == '/our-story' ? true : false
	const isEducation = pathName == '/education' ? true : false

	const isTransparent = isHomepage || isAbout || isEducation ? true : false

	const transparentMenu =
		isTransparent && isIntersecting && !showSubmenu && !openMenu

	// Submenu Items
	const categories = ['Rings', 'Earrings', 'Necklaces', 'Bracelets']

	const quickLinks = content.quickLinks.map(link => link.fields.title)
	const occasion = content.shopByOcassion.map(link => link.fields.title)

	// Reseting open menu
	useEffect(() => {
		isIntersecting && setOpenMenu(false)
	}, [isIntersecting])

	// Show Submenu
	const loadSubmenu = () => {
		setShowSubmenu(true)
	}

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
					<div className={`container ${styles.headerTop}`}>
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
								<p>{content.supportPage.fields.title}</p>
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

						<div className={styles.icons}>
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
						</div>
					</div>

					{((isIntersecting && isScreenWide) || openMenu) && (
						<nav className={`container ${styles.headerBot}`}>
							{/* Shop Page */}
							<Link
								href='/shop'
								aria-label='Link to Shop page.'
								className={styles.mainMenuLink}
								onMouseEnter={() => loadSubmenu()}
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
									onClick={() => setOpenMenu(false)}
								>
									<p>{title}</p>{' '}
									<FiArrowRight className={styles.mobileIcon} strokeWidth={1} />
								</Link>
							))}

							{/* Contentful */}
							{content.mainMenu.map(link => (
								<Link
									key={link.sys.id}
									href={
										'/' + link.fields.title.replace(/ /g, '-').toLowerCase()
									}
									aria-label={`Link to ${link.fields.title} page.`}
									className={styles.mainMenuLink}
									onClick={() => setOpenMenu(false)}
								>
									<p>{link.fields.title}</p>{' '}
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

					{content.showDropdownMenu && showSubmenu && (
						<div className={`container ${styles.subMenu}`}>
							<div className={styles.column2}>
								{categories.map((title, index) => (
									<Link
										key={index}
										href={`/shop/${title.toLowerCase()}`}
										aria-label={`Link to ${title} page.`}
										className={styles.subMenuLink}
									>
										<p>{title}</p>{' '}
									</Link>
								))}
							</div>

							<div className={styles.column2}>
								<p>Quick Links</p>
								{quickLinks.map(link => (
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
