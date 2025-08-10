// components
import PageContent from '@/components/PageContent'
import { notFound } from 'next/navigation'

// lib
import { getEntries } from '@/lib/contentful'

// Fetch pages at build time
const pages = await getEntries('page')

// helper to keep slug generation consistent in one place
const slugify = title =>
	title
		.toLowerCase()
		.replace(/[^a-z0-9 ]/gi, '') // allow alnum + space only
		.replace(/&/g, '')
		.trim()
		.replace(/ +/g, '-')

// Function to generate static params for dynamic routing
export async function generateStaticParams() {
	return pages.items
		.filter(p => p.fields.dontRender !== true)
		.map(page => ({ slug: slugify(page.fields.title) }))
}

export async function generateMetadata(props) {
	const params = await props.params
	const { slug } = params

	const matchedPage = pages.items.find(
		page => slugify(page.fields.title) === slug
	)

	if (!matchedPage) {
		// let Next render the 404 page metadata
		return { title: 'Difinery | Page not found' }
	}

	const content = matchedPage.fields

	return {
		title: 'Difinery | ' + content.title,
		description: content.description ? content.description : '',
		keywords: content.keywords ? content.keywords : ''
	}
}

// Default export for the page component
export default async function Page(props) {
	const params = await props.params
	const { slug } = params

	const matchedPage = pages.items.find(
		page => slugify(page.fields.title) === slug
	)

	if (!matchedPage) {
		notFound()
	}

	const content = matchedPage.fields

	return <PageContent content={content} />
}
