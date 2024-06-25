// styles
import styles from './Features.module.scss'

// components
import Image from 'next/image'

// lib
import { getEntry } from '@/lib/contentful'

const Features = async ({ features }) => {
	const content = []

	if (features) {
		for (let i = 0; i < features.length; i++) {
			const feature = await getEntry(features[i].sys.id)
			content.push(feature)
		}
	}

	return (
		<section>
			<div className={`container ${styles.content}`}>
				<h3>
					Handcrafted in the Diamond District with 100% recycled gold and
					sustainably created diamonds{' '}
				</h3>

				<div className={styles.columns}>
					{content.map(item => (
						<div key={item.sys.id} className={styles.column}>
							<Image
								src={'https:' + item.fields.image.fields.file.url}
								alt='Icon'
								width={64}
								height={64}
								style={{ objectFit: 'contain', objectPosition: 'center' }}
							/>
							<p>{item.fields.text}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

export default Features
