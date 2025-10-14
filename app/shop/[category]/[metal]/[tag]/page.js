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

const ALLOWED_TAGS = [
	'marquise',
	'round',
	'pear',
	'heart',
	'radiant',
	'oval',
	'emerald',
	'prong',
	'4-prong',
	'bezel',
	'martini',
	'fishtail',
	'eternity-rings',
	'solitaire-rings',
	'statement-rings',
	'stackable-rings',
	'open-rings',
	'everyday-diamond-rings',
	'studs',
	'hoops',
	'multi-pendant-necklaces',
	'pendant-necklaces',
	'multi-pendant-bracelets',
	'pendant-bracelets'
]

// Contentful
const pages = await getEntries('page')
const content =
	pages.items.find(page => page.fields.title == 'Shop')?.fields || {}

export async function generateStaticParams() {
	// Pre-render combinations of category and metal
	return ALLOWED_CATEGORIES.flatMap(category =>
		ALLOWED_METALS.flatMap(metal =>
			ALLOWED_TAGS.map(tag => ({ category, metal, tag }))
		)
	)
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
	const { category, metal, tag } = params
	if (!ALLOWED_CATEGORIES.includes(category)) notFound()
	if (!ALLOWED_METALS.includes(metal)) notFound()
	if (!ALLOWED_TAGS.includes(tag)) notFound()

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
					selectedTag={tag}
					showFilters
				/>
			</Suspense>
			<PageContent content={content} />
		</main>
	)
}
