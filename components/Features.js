// styles
import styles from './Features.module.scss'

// components
import Image from 'next/image'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

// lib
import { getEntriesByIds } from '@/lib/contentful'

const Features = async ({ features, title, stylizedTitle }) => {
	let content = []
	if (features && features.length) {
		const ids = features.map(f => f.sys.id)
		const { items } = await getEntriesByIds(ids)
		content = items
	}

	return (
		<section>
			<div className={`container ${styles.content}`}>
				{stylizedTitle ? (
					<div className={`stylizedH3 ${styles.sectionTitle}`}>
						{documentToReactComponents(stylizedTitle)}
					</div>
				) : (
					<h3>{title}</h3>
				)}

				<div className={styles.columns}>
					{content.map(item => (
						<div key={item.sys.id} className={styles.column}>
							{item.fields.image && (
								<Image
									src={'https:' + item.fields.image.fields.file.url}
									alt='Icon'
									width={54}
									height={54}
									style={{ objectFit: 'contain', objectPosition: 'center' }}
								/>
							)}
							{item.fields.number && <h2>{item.fields.number}</h2>}
							<p>{item.fields.text}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

export default Features
