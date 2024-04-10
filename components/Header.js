// styles
import styles from './Header.module.scss'

// components
import Link from 'next/link'
import Image from 'next/image'

// icons
import { FiShoppingBag, FiUser } from 'react-icons/fi'

const Header = () => {
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
		<header className={styles.header}>
			<div className={`container ${styles.headerTop}`}>
				<Link href='#' aria-label='#'>
					<p>Customer Support</p>
				</Link>

				<Link href='/' aria-label='Link to homepage.' className={styles.logo}>
					<Image
						src='/logo-black.svg'
						alt='Logo'
						width={160}
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

			<div className={`container ${styles.headerBot}`}>
				{mainMenu.map(link => (
					<Link
						key={link}
						href={link.replace(/ /g, '-').toLowerCase()}
						aria-label={`Link to ${link} page.`}
					>
						<p>{link}</p>
					</Link>
				))}
			</div>
		</header>
	)
}

export default Header
