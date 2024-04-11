// styles
import styles from './Hero.module.scss'

// components
import Button from './Button'
import Image from 'next/image'

const Hero = () => {
	return (
		<section className={styles.hero}>
			<Image
				src='/hero.jpg'
				alt='Hero Image.'
				fill
				style={{ objectFit: 'cover', zIndex: '-1' }}
			/>

			<div className={`container ${styles.content}`}>
				<h2>For every you. Forever.</h2>
				<p>
					We want to be part of your journey passing every milestone,
					commemorating life's forever moments with fair-value, and timeless
					jewelry whether you are here to celebrate an engagement, a wedding, a
					graduation, the perfect friend, or partner, or simply yourself.
				</p>
				<Button text='Shop Now' link='#' white />
			</div>
		</section>
	)
}

export default Hero
