// components
import PageContent from '@/components/PageContent'

// lib
import { getEntries } from '@/lib/contentful'

// Contentful
const pages = await getEntries('page')
const content = pages.items.find(page => page.fields.title == 'Homepage').fields
const rawShareImageUrl = content?.shareImage?.fields?.file?.url
const shareImageUrl = rawShareImageUrl
	? rawShareImageUrl.startsWith('//')
		? `https:${rawShareImageUrl}`
		: rawShareImageUrl
	: null

export const metadata = {
	title: content.seoTitle ? content.seoTitle : 'Difinery',
	description: content.description ? content.description : '',
	keywords: content.keywords ? content.keywords : '',
	openGraph: {
		images: shareImageUrl ? [{ url: shareImageUrl }] : []
	},
	twitter: {
		card: 'summary_large_image',
		images: shareImageUrl ? [shareImageUrl] : []
	}
}

export default async function Home() {
	return <PageContent content={content} />
}
