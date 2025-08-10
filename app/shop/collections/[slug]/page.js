// components
import Products from '@/components/Products'
import PageContent from '@/components/PageContent'
import { Suspense } from 'react'

// lib
import { apolloClient } from '@/lib/apolloClient'
import { GET_COLLECTION_BY_HANDLE } from '@/lib/queries/getCollectionByHandle'
import { getEntries } from '@/lib/contentful'
import { notFound } from 'next/navigation'

// Contentful
const collections = await getEntries('collection')
const pages = await getEntries('page')
const pageContent = pages.items.find(page => page.fields.title == 'Shop').fields

// Function to generate static params for dynamic routing
export async function generateStaticParams() {
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

	const { data } = await apolloClient.query({
		query: GET_COLLECTION_BY_HANDLE,
		variables: { handle: content.handle, first: 250, after: null }
	})

	const initialEdges = data.collectionByHandle?.products.edges
	const initialItems = initialEdges.map(edge => edge.node)
	const initialPageInfo = data.collectionByHandle?.products.pageInfo

	return (
		<main>
			<Suspense fallback={<div>Loading…</div>}>
				<Products
					products={initialItems}
					initialPageInfo={initialPageInfo}
					productType='all'
					showFilters
					collectionPreview={{
						title: content.title,
						media: content.media
					}}
				/>
			</Suspense>
			<PageContent content={pageContent} />
		</main>
	)
}
