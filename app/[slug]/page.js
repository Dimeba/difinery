// components
import PageContent from '@/components/PageContent'

// lib
import { getEntries } from '@/lib/contentful'

// Fetch pages at build time
const pages = await getEntries('page')

// Function to generate static params for dynamic routing
export async function generateStaticParams() {
	return pages.items.map(page => ({
		slug: page.fields.title
			.toLowerCase()
			.replace(/[^a-zA-Z0-9 ]/g, '')
			.replace(/&/g, '')
			.replace(/ /g, '-')
	}));
}

export async function generateMetadata(props) {
    const params = await props.params;
    const { slug } = params

    const content = pages.items.find(
		page =>
			page.fields.title
				.toLowerCase()
				.replace(/[^a-zA-Z0-9 ]/g, '')
				.replace(/&/g, '')
				.replace(/ /g, '-') == slug
	).fields

    return {
		title: 'Difinery | ' + content.title,
		description: content.description ? content.description : '',
		keywords: content.keywords ? content.keywords : ''
	}
}

// Default export for the page component
export default async function Page(props) {
    const params = await props.params;
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
