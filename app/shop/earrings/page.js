// components
import Products from '@/components/Products'
import PageContent from '@/components/PageContent'

// lib
import { apolloClient } from '@/lib/apolloClient'
import { GET_COLLECTION_BY_HANDLE } from '@/lib/queries/getCollectionByHandle'
import { getEntries } from '@/lib/contentful'

// Contentful
const pages = await getEntries('page')
const content = pages.items.find(page => page.fields.title == 'Shop').fields

export const metadata = {
	title: 'Difinery | Earrings',
	description: '',
	keywords: ''
}

export default async function Home() {
	const { data } = await apolloClient.query({
		query: GET_COLLECTION_BY_HANDLE,
		variables: { handle: 'earrings', first: 16, after: null }
	})

	const initialEdges = data.collectionByHandle?.products.edges
	const initialItems = initialEdges.map(edge => edge.node)
	const initialPageInfo = data.collectionByHandle?.products.pageInfo

	return (
		<main>
			<Products
				products={initialItems}
				initialPageInfo={initialPageInfo}
				productType='earrings'
				showFilters
			/>
			<PageContent content={content} />
		</main>
	)
}
