import SmartProducts from '@/components/SmartProducts'
import PageContent from '@/components/PageContent'
import BridalSubnav from '@/components/BridalSubnav'


import { apolloClient } from '@/lib/apolloClient'
import { GET_COLLECTION_BY_HANDLE } from '@/lib/queries/getCollectionByHandle'
import {
	getCachedCollections,
	getCachedShopPageContent
} from '@/lib/cachedContentful'
import { notFound } from 'next/navigation'
import {
	getShareImageFromProducts,
	getSocialImageMetadata
} from '@/lib/shareImage'
import { BRIDAL_PAGES, getBridalPage } from '@/lib/bridal'

export const revalidate = false

export function generateStaticParams() {
	return BRIDAL_PAGES.map(page => ({ slug: page.slug }))
}

async function getEngagementContent() {
	const collections = await getCachedCollections()
	return (
		collections.items.find(
			collection => collection.fields.handle === 'engagement-rings'
		)?.fields || null
	)
}

export async function generateMetadata(props) {
	const { slug } = await props.params
	const page = getBridalPage(slug)

	if (!page) {
		return { title: 'Difinery | Page not found' }
	}

	const engagement = await getEngagementContent()
	const { data } = await apolloClient.query({
		query: GET_COLLECTION_BY_HANDLE,
		variables: { handle: page.handle, first: 20, after: null },
		context: {
			fetchOptions: {
				next: { revalidate: false }
			}
		}
	})
	const previewProducts = (data.collectionByHandle?.products?.edges || []).map(
		edge => edge.node
	)
	const rawShareImageUrl = engagement?.shareImage?.fields?.file?.url
	const contentfulShareImage = rawShareImageUrl
		? rawShareImageUrl.startsWith('//')
			? `https:${rawShareImageUrl}`
			: rawShareImageUrl
		: null
	const shareImage =
		contentfulShareImage || getShareImageFromProducts(previewProducts)

	return {
		title: 'Difinery | ' + page.title,
		...getSocialImageMetadata(shareImage, { path: `/bridal/${slug}` })
	}
}

export default async function Page(props) {
	const { slug } = await props.params
	const page = getBridalPage(slug)

	if (!page) {
		notFound()
	}

	const engagement = await getEngagementContent()
	const pageContent = await getCachedShopPageContent()

	const { data } = await apolloClient.query({
		query: GET_COLLECTION_BY_HANDLE,
		variables: { handle: page.handle, first: 60, after: null },
		context: {
			fetchOptions: {
				next: { revalidate: false }
			}
		}
	})

	if (!data.collectionByHandle) {
		notFound()
	}

	const initialEdges = data.collectionByHandle.products.edges
	const initialItems = initialEdges.map(edge => edge.node)
	const initialPageInfo = data.collectionByHandle.products.pageInfo
	const mergedPageContent = {
		...pageContent,
		...(engagement || {}),
		title: page.title,
		sections: [
			...(engagement?.sections || []),
			...(pageContent?.sections || [])
		]
	}

	return (
		<main>
			<h1 className='visually-hidden'>{page.title}</h1>
			<BridalSubnav activeSlug={page.slug} />
			<SmartProducts
				initialProducts={initialItems}
				initialPageInfo={initialPageInfo}
				productType='all'
				collectionHandle={page.handle}
				filters={null}
				category={page.handle}
				flushTop
				collectionPreview={
					page.showHero && engagement?.media
						? {
								title: engagement.title,
								description: engagement.description,
								media: engagement.media,
								mediaLink: engagement.mediaLink
							}
						: null
				}
			/>
			<PageContent content={mergedPageContent} nested />
		</main>
	)
}
