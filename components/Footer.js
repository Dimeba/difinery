// styles
import styles from './Footer.module.scss'

// components
import Link from 'next/link'
import Image from 'next/image'

// links
const help = [
	'Customer Service',
	'Book an Appointment',
	'Shipping',
	'Refund Policy'
]
const service = [
	'FAQs',
	'Data Protection',
	'Payment & Shipping',
	'Terms of Service',
	'Cancellation',
	'Imprint'
]
const collections = [
	'Engagement Rings',
	'Bracelets',
	'Necklaces',
	'Earrings',
	'Rings'
]
const difinery = ['About Us', 'Press', 'Sustainability', 'Production', 'Career']
const toKnow = [
	'Journal',
	'How do diamonds grow in a lab?',
	`The 4C's of Diamonds`,
	'30 Days of Free Returns',
	'Free Insured Express Shipping'
]

const creditLinks = [
	'FAQs',
	'Data Protection',
	'Payment & Shipping',
	'Terms of Service',
	'Cancelation',
	'Imprint'
]

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<div className={`container ${styles.content}`}>
				<div className={styles.column2}>
					<h4>Help</h4>
					<div className={styles.links}>
						{help.map(link => (
							<Link
								key={link}
								href={'/' + link.replace(/ /g, '-').toLowerCase()}
								aria-label={`Link to ${link} page.`}
							>
								<p>{link}</p>
							</Link>
						))}
					</div>
				</div>

				<div className={styles.column2}>
					<h4>Service</h4>
					<div className={styles.links}>
						{service.map(link => (
							<Link
								key={link}
								href={'/' + link.replace(/ /g, '-').toLowerCase()}
								aria-label={`Link to ${link} page.`}
							>
								<p>{link}</p>
							</Link>
						))}
					</div>
				</div>

				<div className={styles.column2}>
					<h4>Collections</h4>
					<div className={styles.links}>
						{collections.map(link => (
							<Link
								key={link}
								href={'/' + link.replace(/ /g, '-').toLowerCase()}
								aria-label={`Link to ${link} page.`}
							>
								<p>{link}</p>
							</Link>
						))}
					</div>
				</div>

				<div className={styles.column2}>
					<h4>Difinery</h4>
					<div className={styles.links}>
						{difinery.map(link => (
							<Link
								key={link}
								href={'/' + link.replace(/ /g, '-').toLowerCase()}
								aria-label={`Link to ${link} page.`}
							>
								<p>{link}</p>
							</Link>
						))}
					</div>
				</div>

				<div className={styles.column4}>
					<h4>Certified Diamonds</h4>
					<div className={styles.logos}>
						<div className={styles.logo1}>
							<Image src='/gia-logo.png' fill alt='GIA logo' />
						</div>

						<div className={styles.logo1}>
							<Image src='/igi-logo.png' fill alt='IGI Logo' />
						</div>

						<div className={styles.logo2}>
							<Image src='/hrd-logo.png' fill alt='HRD Logo' />
						</div>
					</div>
				</div>

				{/* Second Row */}

				<div className={styles.column8}>
					<h4>To Know</h4>
					<div className={styles.links}>
						{toKnow.map(link => (
							<Link
								key={link}
								href={'/' + link.replace(/ /g, '-').toLowerCase()}
								aria-label={`Link to ${link} page.`}
							>
								<p>{link}</p>
							</Link>
						))}
					</div>
				</div>

				<div className={styles.column4}>
					<h4>Follow Us</h4>
					<div className={styles.logos}>
						<Link href='#' aria-label='#'>
							<Image
								src='/instagram-logo.svg'
								width={16}
								height={16}
								alt='GIA logo'
							/>
						</Link>
						<Link href='#' aria-label='#'>
							<Image
								src='/instagram-logo.svg'
								width={16}
								height={16}
								alt='GIA logo'
							/>
						</Link>
						<Link href='#' aria-label='#'>
							<Image
								src='/instagram-logo.svg'
								width={16}
								height={16}
								alt='GIA logo'
							/>
						</Link>
						<Link href='#' aria-label='#'>
							<Image
								src='/instagram-logo.svg'
								width={16}
								height={16}
								alt='GIA logo'
							/>
						</Link>
					</div>
				</div>
			</div>

			<div className={styles.credits}>
				<div className='container'>
					<p>© Difinery</p>

					{creditLinks.map(link => (
						<Link
							key={link}
							href={link.replace(/ /g, '-').toLowerCase()}
							aria-label={`Link to ${link} page.`}
						>
							<p>{link}</p>
						</Link>
					))}
				</div>
			</div>
		</footer>
	)
}

export default Footer
