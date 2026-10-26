// components
import SmartProducts from '@/components/SmartProducts'
import PageContent from '@/components/PageContent'


// lib
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
import { collectionSlug } from '@/lib/collectionSlug'

export const revalidate = false
export async function generateStaticParams() {
	const collections = await getCachedCollections()
	return collections.items
		.filter(c => c.fields.dontRender !== true)
		.map(collection => ({
			slug: collectionSlug(collection.fields.title)
		}))
}

export async function generateMetadata(props) {
	const params = await props.params
	const { slug } = params

	const collections = await getCachedCollections()
	const matched = collections.items.find(
		collection => collectionSlug(collection.fields.title) === slug
	)

	if (!matched) {
		return { title: 'Difinery | Page not found' }
	}

	const content = matched.fields
	const { data } = await apolloClient.query({
		query: GET_COLLECTION_BY_HANDLE,
		variables: { handle: content.handle, first: 20, after: null },
		context: {
			fetchOptions: {
				next: { revalidate: false }
			}
		}
	})
	const previewProducts = (data.collectionByHandle?.products?.edges || []).map(
		edge => edge.node
	)
	const rawShareImageUrl = content?.shareImage?.fields?.file?.url
	const contentfulShareImage = rawShareImageUrl
		? rawShareImageUrl.startsWith('//')
			? `https:${rawShareImageUrl}`
			: rawShareImageUrl
		: null
	const shareImage =
		contentfulShareImage || getShareImageFromProducts(previewProducts)

	return {
		title: 'Difinery | ' + content.title,
		...getSocialImageMetadata(shareImage, {
			path: `/shop/collections/${slug}`
		})
	}
}

export default async function Page(props) {
	const params = await props.params
	const { slug } = params

	const collections = await getCachedCollections()
	const pageContent = await getCachedShopPageContent()

	const matched = collections.items.find(
		collection => collectionSlug(collection.fields.title) === slug
	)

	if (!matched) {
		notFound()
	}

	const content = matched.fields

	// Fetch only 20 products initially for collections (no filters)
	const { data } = await apolloClient.query({
		query: GET_COLLECTION_BY_HANDLE,
		variables: { handle: content.handle, first: 60, after: null },
		context: {
			fetchOptions: {
				next: { revalidate: false }
			}
		}
	})

	const initialEdges = data.collectionByHandle?.products.edges
	const initialItems = initialEdges.map(edge => edge.node)
	const initialPageInfo = data.collectionByHandle?.products.pageInfo
	const mergedPageContent = {
		...pageContent,
		...content,
		title: content.title,
		sections: [
			...(content?.sections || []),
			...(pageContent?.sections || [])
		]
	}

	return (
		<main>
			<h1 className='visually-hidden'>{content.title}</h1>
			<SmartProducts
				initialProducts={initialItems}
				initialPageInfo={initialPageInfo}
				productType='all'
				// showFilters
				collectionHandle={content.handle}
				filters={null}
				category={content.handle}
				collectionPreview={{
					title: content.title,
					description: content.description,
					media: content.media,
					mediaLink: content.mediaLink
				}}
			/>
			<PageContent content={mergedPageContent} nested />
		</main>
	)
}
