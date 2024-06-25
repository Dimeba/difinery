// styles
import styles from './Hero.module.scss'

// components
import Button from './Button'
import Image from 'next/image'

// lib
import { getEntry } from '@/lib/contentful'

const Hero = async ({ title, text, image, link }) => {
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
				<h2>{title}</h2>
				<p>{text}</p>
				<Button text={button.fields.text} link={button.fields.url} white />
			</div>
		</section>
	)
}

export default Hero
