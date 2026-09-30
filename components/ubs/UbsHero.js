// styles
import styles from './Ubs.module.scss'

// components
import Image from 'next/image'

const UbsHero = () => {
	return (
		<div className={styles.hero}>
			<Image
				src='/ubs/hero-banner.jpg'
				alt='Difinery jewelry'
				fill
				priority
				sizes='100vw'
				className={styles.heroBackground}
				style={{ objectFit: 'cover' }}
			/>
		</div>
	)
}

export default UbsHero
