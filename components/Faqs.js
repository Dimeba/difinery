// styles
import styles from './Faqs.module.scss'

// components
import Accordion from './Accordion'
import { Fragment } from 'react'

// An answer in data/faqs.json is a list of blocks: a string is a paragraph and
// { "list": [...] } is a numbered list. Inside any text, **text** is bold, and
// email addresses and the phone number become links.
const INLINE_PATTERN =
	/(\*\*[^*]+\*\*|[\w.+-]+@[\w-]+\.[\w.]+[a-z]|\+1 \(\d{3}\) \d{3}-\d{4})/gi

const renderInline = text =>
	text.split(INLINE_PATTERN).map((part, index) => {
		if (!part) return null

		if (part.startsWith('**') && part.endsWith('**')) {
			return <strong key={index}>{part.slice(2, -2)}</strong>
		}

		if (/^[\w.+-]+@/.test(part)) {
			return (
				<a key={index} href={`mailto:${part}`}>
					{part}
				</a>
			)
		}

		if (part.startsWith('+1 (')) {
			return (
				<a key={index} href={`tel:+${part.replace(/\D/g, '')}`}>
					{part}
				</a>
			)
		}

		return <Fragment key={index}>{part}</Fragment>
	})

const AnswerBlock = ({ block }) => {
	if (typeof block === 'string') {
		return <p>{renderInline(block)}</p>
	}

	if (Array.isArray(block?.list)) {
		return (
			<ol className={styles.list}>
				{block.list.map(item => (
					<li key={item}>
						<p>{renderInline(item)}</p>
					</li>
				))}
			</ol>
		)
	}

	return null
}

const Faqs = ({ title, sections = [] }) => {
	return (
		<section className='topSection'>
			<div className={`container ${styles.faqs}`}>
				<h1>{title}</h1>

				<div className={styles.sections}>
					{sections.map(section => (
						<Accordion
							key={section.title}
							title={section.title}
							extraClass={styles.section}
						>
							{section.items.map(item => (
								<article key={item.question} className={styles.item}>
									<h2 className={styles.question}>{item.question}</h2>
									{item.answer.map((block, index) => (
										<AnswerBlock key={index} block={block} />
									))}
								</article>
							))}
						</Accordion>
					))}
				</div>
			</div>
		</section>
	)
}

export default Faqs
