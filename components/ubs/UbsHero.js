// styles
import styles from './Ubs.module.scss'

// components
import Image from 'next/image'
import Placeholder from './Placeholder'

const UbsHero = () => {
	return (
		<div className={styles.hero}>
			<Placeholder label='' dark className={styles.heroBackground} />

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
				<Placeholder label='UBS logo' className={styles.heroPartnerLogo} />
			</div>
		</div>
	)
}

export default UbsHero
