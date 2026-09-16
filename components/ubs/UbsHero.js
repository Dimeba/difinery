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

			<div className={styles.heroLogos}>
				<Image
					src='/logo-white.svg'
					alt='Difinery'
					width={220}
					height={30}
					className={styles.heroLogo}
					priority
				/>
				<span className={styles.heroDivider} />
				<Image
					src='/ubs/ubs-logo.png'
					alt='UBS'
					width={140}
					height={48}
					className={styles.heroPartnerLogo}
				/>
			</div>
		</div>
	)
}

export default UbsHero
