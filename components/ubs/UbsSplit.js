// styles
import styles from './Ubs.module.scss'

// components
import Placeholder from './Placeholder'

// Image + text row; `reverse` puts the image on the right (desktop only)
const UbsSplit = ({ imageLabel, reverse = false, children }) => {
	return (
		<div className={`${styles.split} ${reverse ? styles.splitReverse : ''}`}>
			<div className={styles.splitMedia}>
				<Placeholder label={imageLabel} />
			</div>
			<div className={styles.splitText}>{children}</div>
		</div>
	)
}

export default UbsSplit
