import { unstable_noStore as noStore } from 'next/cache'

// components
import PageContent from '@/components/PageContent'

// lib
import { getEntries } from '@/lib/contentful'

const pages = await getEntries('page')

export async function generateStaticParams() {
	return pages.items.map(page => ({
		slug: page.fields.title
			.toLowerCase()
			.replace(/[^a-zA-Z0-9 ]/g, '')
			.replace(/&/g, '')
			.replace(/ /g, '-')
	}))
}

export default async function Page({ params }) {
	const { slug } = params

	const content = pages.items.find(
		page =>
			page.fields.title
				.toLowerCase()
				.replace(/[^a-zA-Z0-9 ]/g, '')
				.replace(/&/g, '')
				.replace(/ /g, '-') == slug
	).fields

	// Make sure page is dynamic
	if (content.isDynamic) {
		noStore()
	}

	return <PageContent content={content} />
}
