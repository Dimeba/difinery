// styles
import styles from './Hero.module.scss'

// components
import Button from './Button'
import Image from 'next/image'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

// lib
import { getEntry } from '@/lib/contentful'

const Hero = async ({ title, stylizedTitle, text, image, link }) => {
	const button = await getEntry(link.sys.id)

	return (
		<section className={styles.hero}>
			<Image
				src={'https:' + image}
				alt='Hero Image.'
				fill
				style={{ objectFit: 'cover', zIndex: '-1' }}
			/>

			<div className={`container ${styles.content}`}>
				<div className={styles.heroText}>
					{stylizedTitle && (
						<div className='stylizedH2'>
							{documentToReactComponents(stylizedTitle)}
						</div>
					)}
					{title && !stylizedTitle && <h2>{title}</h2>}

					<p>{text}</p>
				</div>
				<div className={styles.buttonContainer}>
					<Button text={button.fields.text} link={button.fields.url} white />
				</div>
			</div>
		</section>
	)
}

export default Hero
