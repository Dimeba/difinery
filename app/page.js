// components
import PageContent from '@/components/PageContent'

// lib
import { getEntries } from '@/lib/contentful'

// Contentful
const pages = await getEntries('page')
const content = pages.items.find(page => page.fields.title == 'Homepage').fields

export const metadata = {
	title: 'Difinery',
	description: content.description ? content.description : '',
	keywords: content.keywords ? content.keywords : ''
}

export default async function Home() {
	return <PageContent content={content} />
}
