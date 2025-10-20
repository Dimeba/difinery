// components
import Products from '@/components/Products'
import PageContent from '@/components/PageContent'
import { Suspense } from 'react'

// lib
import { apolloClient } from '@/lib/apolloClient'
import { GET_PRODUCTS } from '@/lib/queries/getProducts'
import { getEntries } from '@/lib/contentful'
import { notFound } from 'next/navigation'

const ALLOWED_METALS = ['yellow-gold', 'white-gold', 'rose-gold']

const ALLOWED_STYLES = [
	'all',
	// Rings
	'eternity-rings',
	'solitaire-rings',
	'statement-rings',
	'stackable-rings',
	'open-rings',
	'everyday-diamond-rings',
	// Earrings
	'studs',
	'hoops',
	// Necklaces
	'pendant-necklaces',
	'multi-pendant-necklaces',
	// Bracelets
	'pendant-bracelets',
	'multi-pendant-bracelets'
]

// Contentful
const pages = await getEntries('page')
const content = pages.items.find(page => page.fields.title == 'Shop').fields

export async function generateStaticParams() {
	return ALLOWED_METALS.flatMap(metal =>
		ALLOWED_STYLES.map(style => ({ metal, style }))
	)
}

export const metadata = {
	title: 'Difinery | Shop',
	description: '',
	keywords: ''
}

export default async function ShopAllMetalStylePage(props) {
	const params = await props.params
	const searchParams = await props.searchParams
	const { metal, style } = params

	if (!ALLOWED_METALS.includes(metal)) notFound()
	if (!ALLOWED_STYLES.includes(style)) notFound()

	// Fetch the maximum batch (Shopify cap 250) so filtering works client-side on full dataset
	const { data } = await apolloClient.query({
		query: GET_PRODUCTS,
		variables: { first: 250, after: null }
	})

	const initialEdges = data.products.edges
	const initialItems = initialEdges.map(edge => edge.node)
	const initialPageInfo = data.products.pageInfo

	// Map metal slug to readable label
	const metalLabel =
		metal === 'yellow-gold'
			? 'Yellow Gold'
			: metal === 'white-gold'
			? 'White Gold'
			: 'Rose Gold'

	// Extract filters from URL path and query parameters
	const filters = {
		metal: metal, // Metal comes from URL path
		style: style !== 'all' ? style : null, // Style from URL path (null if 'all')
		shape: searchParams?.shape || null,
		setting: searchParams?.setting || null
	}

	return (
		<main>
			<Suspense fallback={<div>Loading…</div>}>
				<Products
					products={initialItems}
					initialPageInfo={initialPageInfo}
					productType='all'
					selectedMetalType={metalLabel}
					showFilters
					filters={filters}
				/>
			</Suspense>
			<PageContent content={content} />
		</main>
	)
}
