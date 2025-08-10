// components
import Products from '@/components/Products'
import PageContent from '@/components/PageContent'
import { Suspense } from 'react'

// lib
import { apolloClient } from '@/lib/apolloClient'
import { GET_COLLECTION_BY_HANDLE } from '@/lib/queries/getCollectionByHandle'
import { getEntries } from '@/lib/contentful'

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

	const content = collections.items.find(
		collection =>
			collection.fields.title
				.toLowerCase()
				.replace(/[^a-zA-Z0-9 ]/g, '')
				.replace(/&/g, '')
				.replace(/ /g, '-') == slug
	).fields

	return {
		title: 'Difinery | ' + content.title
		// description: content.description ? content.description : '',
		// keywords: content.keywords ? content.keywords : ''
	}
}

export default async function Page(props) {
	const params = await props.params
	const { slug } = params

	const content = collections.items.find(
		collection =>
			collection.fields.title
				.toLowerCase()
				.replace(/[^a-zA-Z0-9 ]/g, '')
				.replace(/&/g, '')
				.replace(/ /g, '-') == slug
	).fields

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
