// components
import Products from '@/components/Products'
import PageContent from '@/components/PageContent'
import { Suspense } from 'react'

// lib
import { apolloClient } from '@/lib/apolloClient'
import { GET_COLLECTION_BY_HANDLE } from '@/lib/queries/getCollectionByHandle'
import { getEntries } from '@/lib/contentful'
import { notFound } from 'next/navigation'

const ALLOWED_CATEGORIES = ['bracelets', 'earrings', 'rings', 'necklaces']

// Contentful
const pages = await getEntries('page')
const content =
	pages.items.find(page => page.fields.title == 'Shop')?.fields || {}

export async function generateStaticParams() {
	return ALLOWED_CATEGORIES.map(category => ({ category }))
}

export async function generateMetadata(props) {
	const params = await props.params
	const { category } = params
	if (!ALLOWED_CATEGORIES.includes(category))
		return { title: 'Difinery | Shop' }
	const titleCase = category.charAt(0).toUpperCase() + category.slice(1)
	return {
		title: `Difinery | ${titleCase}`,
		description: '',
		keywords: ''
	}
}

export default async function CategoryPage(props) {
	const params = await props.params
	const { category } = params
	if (!ALLOWED_CATEGORIES.includes(category)) notFound()

	const { data } = await apolloClient.query({
		query: GET_COLLECTION_BY_HANDLE,
		variables: { handle: category, first: 250, after: null }
	})

	const initialEdges = data.collectionByHandle?.products.edges || []
	const initialItems = initialEdges.map(edge => edge.node)
	const initialPageInfo = data.collectionByHandle?.products.pageInfo

	return (
		<main>
			<Suspense fallback={<div>Loading…</div>}>
				<Products
					products={initialItems}
					initialPageInfo={initialPageInfo}
					productType={category}
					showFilters
				/>
			</Suspense>
			<PageContent content={content} />
		</main>
	)
}
