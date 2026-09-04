// styles
import styles from './ArticleFooter.module.scss'

// components
import { Typography } from '@mui/material'
import {
	FaLinkedinIn,
	FaInstagram,
	FaTiktok,
	FaFacebookF,
	FaXTwitter,
	FaGlobe
} from 'react-icons/fa6'

const detectPlatform = url => {
	const value = url.toLowerCase()

	if (value.includes('linkedin.com')) return 'linkedin'
	if (value.includes('instagram.com')) return 'instagram'
	if (value.includes('tiktok.com')) return 'tiktok'
	if (value.includes('facebook.com') || value.includes('fb.com'))
		return 'facebook'
	if (value.includes('twitter.com') || value.includes('x.com')) return 'x'

	return 'website'
}

const platformIcons = {
	linkedin: FaLinkedinIn,
	instagram: FaInstagram,
	tiktok: FaTiktok,
	facebook: FaFacebookF,
	x: FaXTwitter,
	website: FaGlobe
}

const platformLabels = {
	linkedin: 'LinkedIn',
	instagram: 'Instagram',
	tiktok: 'TikTok',
	facebook: 'Facebook',
	x: 'X',
	website: 'Website'
}

const parseSocialLinks = socialMedia => {
	if (!socialMedia) return []

	const raw = Array.isArray(socialMedia) ? socialMedia.join('\n') : socialMedia

	return raw
		.split(/[\n,]+/)
		.map(link => link.trim())
		.filter(Boolean)
		.map(url => {
			const href = /^https?:\/\//i.test(url) ? url : `https://${url}`
			const platform = detectPlatform(href)
			return { href, platform }
		})
}

const ArticleFooter = ({ artistName, socialMedia }) => {
	const links = parseSocialLinks(socialMedia)

	return (
		<section className={styles.footer}>
			<div className={`container ${styles.content}`}>
				<Typography variant='h3' component='h3' className={styles.title}>
					Follow {artistName}
				</Typography>

				<Typography variant='p' component='p' className={styles.subtitle}>
					Discover more work
				</Typography>

				{links.length > 0 && (
					<div className={styles.socials}>
						{links.map(({ href, platform }) => {
							const Icon = platformIcons[platform]

							return (
								<a
									key={href}
									href={href}
									target='_blank'
									rel='noopener noreferrer'
									aria-label={platformLabels[platform]}
									className={styles.socialLink}
								>
									<Icon size={18} />
								</a>
							)
						})}
					</div>
				)}
			</div>
		</section>
	)
}

export default ArticleFooter
