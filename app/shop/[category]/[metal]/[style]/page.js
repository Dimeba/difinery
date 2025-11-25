// components
import SmartProducts from '@/components/SmartProducts'
import PageContent from '@/components/PageContent'
import { Suspense } from 'react'

// lib
import { fetchProductsSmart } from '@/lib/smartFetch'
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

export const revalidate = 3600 // Revalidate every hour

export async function generateStaticParams() {
	// Pre-render combinations of category, metal, and style
	return ALLOWED_CATEGORIES.flatMap(category =>
		ALLOWED_METALS.flatMap(metal =>
			ALLOWED_STYLES.map(style => ({ category, metal, style }))
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

export default async function CategoryMetalStylePage(props) {
	const params = await props.params
	const searchParams = await props.searchParams
	const { category, metal, style } = params

	if (!ALLOWED_CATEGORIES.includes(category)) notFound()
	if (!ALLOWED_METALS.includes(metal)) notFound()
	if (!ALLOWED_STYLES.includes(style)) notFound()

	// Fetch Contentful data inside the function
	const pages = await getEntries('page')
	const content =
		pages.items.find(page => page.fields.title == 'Shop')?.fields || {}

	// Extract filters from URL path and query parameters
	const currentFilters = {
		metal: metal, // Metal comes from URL path
		style: style !== 'all' ? style : null, // Style from URL path (null if 'all')
		shape: searchParams?.shape || null,
		setting: searchParams?.setting || null
	}

	// Smart fetch: 20 products if no filters, 250 if filters active
	const { edges, pageInfo } = await fetchProductsSmart(currentFilters, category)

	const initialItems = edges.map(edge => edge.node)
	const initialPageInfo = pageInfo

	// Map metal slug to readable label
	const metalLabel =
		metal === 'yellow-gold'
			? 'Yellow Gold'
			: metal === 'white-gold'
			? 'White Gold'
			: 'Rose Gold'

	return (
		<main>
			<Suspense fallback={<div>Loading…</div>}>
				<SmartProducts
					initialProducts={initialItems}
					initialPageInfo={initialPageInfo}
					productType={category}
					selectedMetalType={metalLabel}
					showFilters
					filters={currentFilters}
					category={category}
				/>
			</Suspense>
			<PageContent content={content} />
		</main>
	)
}
