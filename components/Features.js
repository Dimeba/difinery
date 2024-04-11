// styles
import styles from './Features.module.scss'

// components
import Image from 'next/image'

const Features = () => {
	const features = [
		{
			icon: '/sustainability-icon.svg',
			description: `Sustainably created diamonds with transparent provenance`
		},
		{
			icon: '/recycle-icon.svg',
			description: `100% recycled 14k & 18k solid gold`
		},
		{
			icon: '/quality-icon.svg',
			description: `Excellent quality, handcrafted in the Diamond District`
		},
		{
			icon: '/guarantee-icon.svg',
			description: `Lifetime guarantee on our diamonds & gemstones`
		},
		{
			icon: '/price-icon.svg',
			description: `Price transparency on every model and every purchase`
		}
	]

	return (
		<section className={styles.features}>
			<div className={`container ${styles.content}`}>
				<h3>
					Handcrafted in the Diamond District with 100% recycled gold and
					sustainably created diamonds{' '}
				</h3>

				<div className={styles.columns}>
					{features.map((item, index) => (
						<div key={index} className={styles.column}>
							<Image
								src={item.icon}
								alt='Icon'
								width={48}
								height={48}
								style={{ objectFit: 'contain', objectPosition: 'center' }}
							/>
							<p>{item.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

export default Features
