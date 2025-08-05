// styles
import styles from './Footer.module.scss'

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
import SubscribeForm from './SubscribeForm'

const Footer = ({ content }) => {
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

	return (
		<footer className={styles.footer}>
			<div className={styles.content}>
				<Accordion
					title='Help'
					state={true}
					hideBorder={true}
					disabled={true}
					extraClass={styles.column2}
				>
					<div className={styles.links}>
						{content.help.map(link => (
							<Link
								key={link.sys.id}
								href={
									'/' +
									link.fields.title
										.replace(/ /g, '-')
										.replace(/&/g, '')
										.toLowerCase()
								}
								aria-label={`Link to ${link.fields.title} page.`}
							>
								<p>{link.fields.title}</p>
							</Link>
						))}
					</div>
				</Accordion>

				<SubscribeForm />
			</div>

			{/* Second Row */}

			<div className={styles.secondRow}>
				<div className={styles.iconsSection}>
					<div className={styles.column4}>
						<h4>Certified Diamonds</h4>
						<div className={styles.logos}>
							{content.certifications.map(certification => (
								<div className={styles.logo} key={certification.sys.id}>
									<Image
										src={'https:' + certification.fields.file.url}
										height={60}
										width={
											certification.fields.file.details.image.width /
											(certification.fields.file.details.image.height / 60)
										}
										// fill
										alt='Certification Logo'
									/>
								</div>
							))}
						</div>
					</div>

					<div className={styles.column4}>
						<h4>Handcrafted in USA</h4>
						<Image
							src='/m-i-usa.png'
							height={40}
							width={60}
							// fill
							alt='made in usa icon'
						/>
					</div>
					<div className={styles.column4}>
						<h4>Follow Us</h4>
						<div className={styles.logos}>
							{content.social.map((link, index) => (
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
			<div className={styles.credits}>
				<div className='container'>
					<p>© Difinery</p>

					{content.bottomMenu.map(link => (
						<Link
							key={link.sys.id}
							href={
								'/' +
								link.fields.title
									.replace(/ /g, '-')
									.replace(/&/g, '')
									.toLowerCase()
							}
							aria-label={`Link to ${link.fields.title} page.`}
						>
							<p>{link.fields.title}</p>
						</Link>
					))}
				</div>
			</div>
		</footer>
	)
}

export default Footer
