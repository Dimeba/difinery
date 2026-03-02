// components
import Products from '@/components/Products'
import PageContent from '@/components/PageContent'
import ProductsSkeleton from '@/components/ProductsSkeleton'

import { Suspense } from 'react'

// lib
import { apolloClient } from '@/lib/apolloClient'
import { GET_COLLECTION_BY_HANDLE } from '@/lib/queries/getCollectionByHandle'
import {
	getCachedCollections,
	getCachedShopPageContent
} from '@/lib/cachedContentful'
import { notFound } from 'next/navigation'

export const revalidate = 3600 // Revalidate every hour
export async function generateStaticParams() {
	const collections = await getCachedCollections()
	return collections.items
		.filter(c => c.fields.dontRender !== true)
		.map(collection => ({
			slug: collection.fields.title
				.toLowerCase()
				.replace(/[^a-zA-Z0-9 ]/g, '')
				.replace(/&/g, '')
				.replace(/ /g, '-')
		}))
}

export async function generateMetadata(props) {
	const params = await props.params
	const { slug } = params

	const collections = await getCachedCollections()
	const matched = collections.items.find(
		collection =>
			collection.fields.title
				.toLowerCase()
				.replace(/[^a-zA-Z0-9 ]/g, '')
				.replace(/&/g, '')
				.replace(/ /g, '-') === slug
	)

	if (!matched) {
		return { title: 'Difinery | Page not found' }
	}

	const content = matched.fields
	return {
		title: 'Difinery | ' + content.title
	}
}

export default async function Page(props) {
	const params = await props.params
	const { slug } = params

	const collections = await getCachedCollections()
	const pageContent = await getCachedShopPageContent()

	const matched = collections.items.find(
		collection =>
			collection.fields.title
				.toLowerCase()
				.replace(/[^a-zA-Z0-9 ]/g, '')
				.replace(/&/g, '')
				.replace(/ /g, '-') === slug
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
				next: { revalidate: 3600 } // Cache for 1 hour
			}
		}
	})

	const initialEdges = data.collectionByHandle?.products.edges
	const initialItems = initialEdges.map(edge => edge.node)
	const initialPageInfo = data.collectionByHandle?.products.pageInfo

	return (
		<main>
			<Suspense fallback={<ProductsSkeleton count={20} />}>
				<Products
					products={initialItems}
					initialPageInfo={initialPageInfo}
					productType='all'
					// showFilters
					collectionHandle={content.handle}
					collectionPreview={{
						title: content.title,
						description: content.description,
						media: content.media,
						mediaLink: content.mediaLink
					}}
				/>
			</Suspense>
			<PageContent content={pageContent} />
		</main>
	)
}
