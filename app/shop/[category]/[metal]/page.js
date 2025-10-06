// components
import Products from '@/components/Products'
import PageContent from '@/components/PageContent'
import { Suspense } from 'react'

// lib
import { apolloClient } from '@/lib/apolloClient'
import { GET_COLLECTION_BY_HANDLE } from '@/lib/queries/getCollectionByHandle'
import { GET_PRODUCTS } from '@/lib/queries/getProducts'
import { getEntries } from '@/lib/contentful'
import { notFound } from 'next/navigation'

const ALLOWED_CATEGORIES = [
	'bracelets',
	'earrings',
	'rings',
	'necklaces',
	'all'
]

const ALLOWED_METALS = ['yellow-gold', 'white-gold', 'rose-gold']

// Contentful
const pages = await getEntries('page')
const content =
	pages.items.find(page => page.fields.title == 'Shop')?.fields || {}

export async function generateStaticParams() {
	// Pre-render combinations of category and metal
	return ALLOWED_CATEGORIES.flatMap(category =>
		ALLOWED_METALS.map(metal => ({ category, metal }))
	)
}

export async function generateMetadata(props) {
	const params = await props.params
	const { category, metal } = params
	if (!ALLOWED_CATEGORIES.includes(category))
		return { title: 'Difinery | Shop' }
	const catTitle = category.charAt(0).toUpperCase() + category.slice(1)
	const metalTitle = metal
		? metal
				.split('-')
				.map(s => s.charAt(0).toUpperCase() + s.slice(1))
				.join(' ')
		: ''
	const title = metalTitle
		? `Difinery | ${catTitle} | ${metalTitle}`
		: `Difinery | ${catTitle}`
	return { title, description: '', keywords: '' }
}

export default async function CategoryPage(props) {
	const params = await props.params
	const { category, metal } = params
	if (!ALLOWED_CATEGORIES.includes(category)) notFound()
	if (!ALLOWED_METALS.includes(metal)) notFound()

	const { data } = await apolloClient.query({
		query: category === 'all' ? GET_PRODUCTS : GET_COLLECTION_BY_HANDLE,
		variables:
			category === 'all'
				? { first: 250, after: null }
				: { handle: category, first: 250, after: null }
	})

	const isAll = category === 'all'
	const initialEdges = isAll
		? data.products?.edges || []
		: data.collectionByHandle?.products?.edges || []
	const initialItems = initialEdges.map(edge => edge.node)
	const initialPageInfo = isAll
		? data.products?.pageInfo
		: data.collectionByHandle?.products?.pageInfo

	// Map metal slug to readable label for ProductCard/Products expectations
	const metalLabel =
		metal === 'yellow-gold'
			? 'Yellow Gold'
			: metal === 'white-gold'
			? 'White Gold'
			: 'Rose Gold'

	return (
		<main>
			<Suspense fallback={<div>Loading…</div>}>
				<Products
					products={initialItems}
					initialPageInfo={initialPageInfo}
					productType={category}
					selectedMetalType={metalLabel}
					showFilters
				/>
			</Suspense>
			<PageContent content={content} />
		</main>
	)
}
