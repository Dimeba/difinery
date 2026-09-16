// styles
import styles from './Ubs.module.scss'

// components
import Button from '../Button'
import Placeholder from './Placeholder'

const UbsCta = () => {
	return (
		<div className={styles.cta}>
			<Placeholder label='Background image' className={styles.ctaBackground} />

			<div className={`container ${styles.centered} ${styles.ctaContent}`}>
				<h2>A New Standard in Fine Jewelry, Reserved for You</h2>
				<p className={styles.lead}>
					Explore the full Difinery collection with your UBS staff discount
					already applied.
				</p>
				<Button text='Shop Now' />
			</div>
		</div>
	)
}

export default UbsCta
