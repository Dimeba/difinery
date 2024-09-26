// styles
import styles from './FAQ.module.scss'

// components
import Accordion from './Accordion'

// contentful
import { getEntry } from '@/lib/contentful'

const FAQ = async ({ title, content, productDetails }) => {
	const rows = []

	if (content) {
		for (const item of content) {
			const entry = await getEntry(item.sys.id)
			rows.push(entry.fields)
		}
	}

	return (
		<section>
			<div className={`container ${styles.faq}`}>
				<h3>{title}</h3>

				<div className={styles.accordion}>
					{productDetails && (
						<Accordion title='Product Details'>
							<p>{productDetails}</p>
						</Accordion>
					)}

					{rows.map((row, index) => (
						<Accordion key={index} title={row.title}>
							<p>{row.text}</p>
						</Accordion>
					))}
				</div>
			</div>
		</section>
	)
}

export default FAQ
