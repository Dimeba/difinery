// components
import PageContent from '@/components/PageContent'
import JsonLd from '@/components/JsonLd'

// lib
import { getEntries } from '@/lib/contentful'
import { getSocialImageMetadata } from '@/lib/shareImage'
import { organizationJsonLd, websiteJsonLd } from '@/lib/structuredData'

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
	...getSocialImageMetadata(shareImageUrl, { path: '/' })
}

export default async function Home() {
	return (
		<>
			<JsonLd data={organizationJsonLd()} />
			<JsonLd data={websiteJsonLd()} />
			<PageContent content={content} />
		</>
	)
}
