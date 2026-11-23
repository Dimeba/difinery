// components
import Faqs from '@/components/Faqs'
import JsonLd from '@/components/JsonLd'

// lib
import { getSocialImageMetadata } from '@/lib/shareImage'
import { faqPageJsonLd } from '@/lib/structuredData'

// content
import faqs from '@/data/faqs.json' with { type: 'json' }

export const metadata = {
	title: 'Difinery | FAQs',
	description:
		'Answers about Difinery fine jewelry: 14k recycled solid gold, lab-grown diamonds, sizing, shipping, returns, warranty, care and custom engagement rings.',
	...getSocialImageMetadata(null, { path: '/faqs' })
}

export default function FaqsPage() {
	return (
		<main>
			<JsonLd data={faqPageJsonLd(faqs.sections)} />
			<Faqs title={faqs.title} sections={faqs.sections} />
		</main>
	)
}
