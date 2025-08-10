// components
import Products from '@/components/Products'
import PageContent from '@/components/PageContent'
import { Suspense } from 'react'

// lib
import { apolloClient } from '@/lib/apolloClient'
import { GET_COLLECTION_BY_HANDLE } from '@/lib/queries/getCollectionByHandle'
import { getEntries } from '@/lib/contentful'

// Contentful
const pages = await getEntries('page')
const content = pages.items.find(page => page.fields.title == 'Shop').fields

export const metadata = {
	title: 'Difinery | Necklaces',
	description: '',
	keywords: ''
}

export default async function Home() {
	const { data } = await apolloClient.query({
		query: GET_COLLECTION_BY_HANDLE,
		variables: { handle: 'necklaces', first: 250, after: null }
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
					productType='necklaces'
					showFilters
				/>
			</Suspense>
			<PageContent content={content} />
		</main>
	)
}
