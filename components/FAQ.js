// styles
import styles from './FAQ.module.scss'

// components
import Accordion from './Accordion'

// contentful
import { getEntry } from '@/lib/contentful'

const FAQ = async ({ title, content }) => {
	const rows = []

	for (const item of content) {
		const entry = await getEntry(item.sys.id)
		rows.push(entry.fields)
	}

	return (
		<section>
			<div className={`container ${styles.faq}`}>
				<h3>{title}</h3>

				<div className={styles.accordion}>
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
