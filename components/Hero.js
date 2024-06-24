// styles
import styles from './Hero.module.scss'

// components
import Button from './Button'
import Image from 'next/image'

const Hero = ({ title, text, image }) => {
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
				<Button text='Shop Now' link='/shop' white />
			</div>
		</section>
	)
}

export default Hero
