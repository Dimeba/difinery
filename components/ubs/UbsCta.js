// styles
import styles from './Ubs.module.scss'

// components
import Image from 'next/image'
import Button from '../Button'

const UbsCta = () => {
	return (
		<div className={styles.cta}>
			<Image
				src='/ubs/bottom-banner.jpg'
				alt='Difinery design sketch'
				fill
				sizes='100vw'
				className={styles.ctaBackground}
				style={{ objectFit: 'cover' }}
			/>

			<div className={`container ${styles.centered} ${styles.ctaContent}`}>
				<h2>A New Standard in Fine Jewelry, Reserved for You</h2>
				<p className={styles.lead}>
					Explore the full Difinery collection with your UBS staff discount
					already applied.
				</p>
				<Button text='Shop Now' link='/shop' red />
			</div>
		</div>
	)
}

export default UbsCta
