// styles
import styles from './Footer.module.scss'
import KlaviyoForm from './KlaviyoForm'

// components
import Link from 'next/link'
import Image from 'next/image'
import Accordion from './Accordion'
import {
	FaInstagram,
	FaTiktok,
	FaPinterest,
	FaYoutube,
	FaEtsy
} from 'react-icons/fa'

const FOOTER_CONTENT = {
	difinery: [
		{ title: 'Our Story', href: '/our-story' },
		{ title: 'Blank Canvas', href: '/blank-canvas' },
		{ title: 'Lab - Grown Diamonds', href: '/lab-grown-diamonds' },
		{ title: '14K Certified Recycled Solid Gold', href: '/14k-certified-recycled-solid-gold' },
	],
	help: [
		{ title: 'Customer Service', href: '/customer-service' },
		{ title: 'Shipping', href: '/shipping' },
		{ title: 'Return & Refund Policy', href: '/return-refund-policy' },
		{ title: 'FAQs', href: '/faqs' }
	],
	legal: [
		{ title: 'Terms of Service', href: '/terms-of-service' },
		{ title: 'Privacy Policy', href: '/privacy-policy' },
		{ title: 'Warranty & Care Policy', href: '/warranty-care-policy' },
	],
	social: [
		'https://instagram.com/',
		'https://tiktok.com/',
		'https://pinterest.com/',
		'https://youtube.com/'
	],
	certifications: [
		{
			src: '/footer/usa.png',
			alt: 'Made in USA',
			width: 61,
			height: 40
		},
		{
			src: '/footer/planet.png',
			alt: 'Planet',
			width: 94,
			height: 40
		}
	]
}

const isContentfulLink = link => Boolean(link?.fields?.title)
const isContentfulAsset = asset => Boolean(asset?.fields?.file?.url)

const Footer = ({ content = FOOTER_CONTENT }) => {
	const returnCorrecticon = (url, size) => {
		if (url.includes('instagram')) {
			return <FaInstagram size={size} />
		} else if (url.includes('tiktok')) {
			return <FaTiktok size={size} />
		} else if (url.includes('pinterest')) {
			return <FaPinterest size={size} />
		} else if (url.includes('youtube')) {
			return <FaYoutube size={size} />
		} else if (url.includes('etsy')) {
			return <FaEtsy size={size} />
		}
	}

	const categories = ['Rings', 'Earrings', 'Necklaces', 'Bracelets']

	// Keep in sync with `app/[slug]/page.js` slugify()
	const formatLink = (str = '') => {
		const slug = str
			.toString()
			.toLowerCase()
			.replace(/[^a-z0-9 ]/gi, '')
			.replace(/&/g, '')
			.trim()
			.replace(/ +/g, '-')
		return '/' + slug
	}

	const normalizeLinks = links =>
		(Array.isArray(links) ? links : [])
			.map(link => {
				if (isContentfulLink(link)) {
					const title = link.fields.title
					return { title, href: formatLink(title), key: link?.sys?.id || title }
				}

				if (typeof link === 'string') {
					return { title: link, href: formatLink(link), key: link }
				}

				const title = link?.title
				const href = link?.href || (title ? formatLink(title) : '/')
				return { title, href, key: link?.key || href || title }
			})
			.filter(l => l?.title && l?.href)

	const difineryLinks = normalizeLinks(content?.difinery)
	const helpLinks = normalizeLinks(content?.help)
	const legalLinks = normalizeLinks(content?.legal)
	const socialLinks = Array.isArray(content?.social) ? content.social : []
	const certifications = Array.isArray(content?.certifications)
		? content.certifications
		: []

	return (
		<footer className={styles.footer}>
			<div className={styles.content}>
				<Accordion
					title='Difinery'
					state={true}
					hideBorder={true}
					disabled={true}
					extraClass={styles.column3}
				>
					<div className={styles.links}>
						{difineryLinks.map(link => (
							<Link
								key={link.key}
								href={link.href}
								aria-label={`Link to ${link.title} page.`}
							>
								<p>{link.title}</p>
							</Link>
						))}
					</div>
				</Accordion>

				{/* <Accordion
					title='Shop'
					state={true}
					hideBorder={true}
					disabled={true}
					extraClass={styles.column3}
				>
					<div className={styles.links}>
						{categories.map((title, index) => (
							<Link
								key={index}
								href={`/shop/${title.toLowerCase()}`}
								aria-label={`Link to ${title} page.`}
							>
								<p>{title}</p>
							</Link>
						))}
					</div>
				</Accordion> */}

				<Accordion
					title='Help'
					state={true}
					hideBorder={true}
					disabled={true}
					extraClass={styles.column3}
				>
					<div className={styles.links}>
						{helpLinks.map(link => (
							<Link
								key={link.key}
								href={link.href}
								aria-label={`Link to ${link.title} page.`}
							>
								<p>{link.title}</p>
							</Link>
						))}
					</div>
				</Accordion>

				<Accordion
					title='Legal'
					state={true}
					hideBorder={true}
					disabled={true}
					extraClass={styles.column3}
				>
					<div className={styles.links}>
						{legalLinks.map(link => (
							<Link
								key={link.key}
								href={link.href}
								aria-label={`Link to ${link.title} page.`}
							>
								<p>{link.title}</p>
							</Link>
						))}
					</div>
				</Accordion>

				<Accordion
					title='Subscribe'
					state={true}
					hideBorder={true}
					disabled={true}
					extraClass={styles.column3}
				>
					<p style={{ marginBottom: '1rem' }}>
						No spam. Just meaningful updates on timeless pieces, artist stories,
						and sustainability insights.
					</p>
					{/* <SubscribeForm isFooter /> */}
					<KlaviyoForm
						fields={[
							{
								name: 'email',
								type: 'email',
								placeholder: 'Enter your email address',
								required: true
							}
						]}
						submitText='Subscribe'
						columns={1}
						isWhite={false}
						listName='subscribers'
					/>
				</Accordion>
			</div>

			{/* Second Row */}

			<div className={styles.secondRow}>
				<div className={styles.iconsSection}>
					<div className={styles.column6}>
						{/* <h4>Certified Diamonds</h4> */}
						<div className={styles.logos}>
							{certifications.map((certification, index) => {
								if (isContentfulAsset(certification)) {
									const url = 'https:' + certification.fields.file.url
									const h = certification.fields.file.details?.image?.height
									const w = certification.fields.file.details?.image?.width
									const height = 40
									const width =
										w && h ? Math.round(w / (h / height)) : 120

									return (
										<div
											className={styles.logo}
											key={certification?.sys?.id || url || index}
										>
											<Image
												src={url}
												height={height}
												width={width}
												alt='Certification logo'
												style={{ width: 'auto', height: 'auto' }}
											/>
										</div>
									)
								}

								return (
									<div
										className={styles.logo}
										key={certification?.src || certification?.key || index}
									>
										<Image
											src={certification.src}
											height={certification.height || 40}
											width={certification.width || 120}
											alt={certification.alt || 'Certification logo'}
											style={{ width: 'auto', height: 'auto' }}
										/>
									</div>
								)
							})}
						</div>
					</div>

					{/* <div className={styles.column6}>
						<h4>Handcrafted in USA</h4>
						<Image
							src='/m-i-usa.png'
							height={40}
							width={60}
							// fill
							alt='made in usa icon'
						/>
					</div> */}
					<div className={styles.column6}>
						{/* <h4>Follow Us</h4> */}
						<div className={styles.logos}>
							{socialLinks.map((link, index) => (
								<Link
									key={index}
									href={link}
									aria-label='Link to social media profile'
									target='_blank'
								>
									{returnCorrecticon(link, 20)}
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
			{/* Credits */}
			{/* <div className={styles.credits}>
				<div className='container'>
					<p>© Difinery</p>

					{content.bottomMenu.map(link => (
						<Link
							key={link.sys.id}
							href={formatLink(link.fields.title)}
							aria-label={`Link to ${link.fields.title} page.`}
						>
							<p>{link.fields.title}</p>
						</Link>
					))}
				</div>
			</div> */}
		</footer>
	)
}

export default Footer
