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

	return <PageContent content={content} />
}
