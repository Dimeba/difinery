export const dynamic = 'force-dynamic'

// components
import PageContent from '@/components/PageContent'

// lib
import { getEntries } from '@/lib/contentful'

export default async function Home() {
	// Contentful
	const pages = await getEntries('page')
	const content = pages.items.find(page => page.fields.title == 'Shop').fields

	return <PageContent content={content} />
}
