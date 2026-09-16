// styles
import styles from './Ubs.module.scss'

// components
import Image from 'next/image'

// Image + text row; `reverse` puts the image on the right (desktop only)
const UbsSplit = ({ image, imageAlt, reverse = false, children }) => {
	return (
		<div className={`${styles.split} ${reverse ? styles.splitReverse : ''}`}>
			<div className={styles.splitMedia}>
				<Image
					src={image}
					alt={imageAlt}
					fill
					sizes='(max-width: 1024px) 100vw, 50vw'
					style={{ objectFit: 'cover' }}
				/>
			</div>
			<div className={styles.splitText}>{children}</div>
		</div>
	)
}

export default UbsSplit
