// components
import Products from '@/components/Products'
import PageContent from '@/components/PageContent'
import { Suspense } from 'react'

// lib
import { apolloClient } from '@/lib/apolloClient'
import { GET_PRODUCTS } from '@/lib/queries/getProducts'
import { getEntries } from '@/lib/contentful'

// Contentful
const pages = await getEntries('page')
const content = pages.items.find(page => page.fields.title == 'Shop').fields

export const metadata = {
	title: 'Difinery | Shop',
	description: '',
	keywords: ''
}

export default async function Home() {
	// Fetch the maximum batch (Shopify cap 250) so filtering works client-side on full dataset
	const { data } = await apolloClient.query({
		query: GET_PRODUCTS,
		variables: { first: 250, after: null }
	})

	const initialEdges = data.products.edges
	const initialItems = initialEdges.map(edge => edge.node)
	const initialPageInfo = data.products.pageInfo

	return (
		<main>
			<Suspense fallback={<div>Loading…</div>}>
				<Products
					products={initialItems}
					initialPageInfo={initialPageInfo}
					productType='all'
					showFilters
				/>
			</Suspense>
			<PageContent content={content} />
		</main>
	)
}
