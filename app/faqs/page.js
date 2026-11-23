// components
import Faqs from '@/components/Faqs'
import JsonLd from '@/components/JsonLd'

// lib
import { getSocialImageMetadata } from '@/lib/shareImage'
import { faqPageJsonLd } from '@/lib/structuredData'

// content
import faqs from '@/data/faqs.json' with { type: 'json' }

// JSON has no comments: an item with "hidden": true stays in the file but is
// left off the page and out of the structured data.
const sections = faqs.sections
	.map(section => ({
		...section,
		items: section.items.filter(item => !item.hidden)
	}))
	.filter(section => section.items.length > 0)

export const metadata = {
	title: 'Difinery | FAQs',
	description:
		'Answers about Difinery fine jewelry: 14k recycled solid gold, lab-grown diamonds, sizing, shipping, returns, warranty, care and custom engagement rings.',
	...getSocialImageMetadata(null, { path: '/faqs' })
}

export default function FaqsPage() {
	return (
		<main>
			<JsonLd data={faqPageJsonLd(sections)} />
			<Faqs title={faqs.title} sections={sections} />
		</main>
	)
}
