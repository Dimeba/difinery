// components
import SmartProducts from '@/components/SmartProducts'
import PageContent from '@/components/PageContent'
import ProductsSkeleton from '@/components/ProductsSkeleton'
import { Suspense } from 'react'

// lib
import { fetchProductsSmart } from '@/lib/smartFetch'
import { getCachedShopPageContent } from '@/lib/cachedContentful'
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
	const { category, metal, style } = params
	if (!ALLOWED_CATEGORIES.includes(category))
		return {
			title: 'Difinery | Shop',
			description:
				'Shop elegant, ethical lab-grown diamond jewelry at Difinery.'
		}

	const titleCase = category.charAt(0).toUpperCase() + category.slice(1)
	const metalLabel =
		metal === 'yellow-gold'
			? 'Yellow Gold'
			: metal === 'white-gold'
			? 'White Gold'
			: 'Rose Gold'
	const styleLabel =
		style !== 'all'
			? style
					.split('-')
					.map(w => w.charAt(0).toUpperCase() + w.slice(1))
					.join(' ')
			: ''

	const description = styleLabel
		? `Shop ${styleLabel} ${titleCase} in ${metalLabel}. Elegant, ethical lab-grown diamond jewelry by Difinery.`
		: `Shop ${metalLabel} ${titleCase}. Elegant, ethical lab-grown diamond jewelry by Difinery.`

	return {
		title: `Difinery | ${titleCase}`,
		description,
		keywords: `lab-grown diamonds, ${titleCase.toLowerCase()}, ${metalLabel.toLowerCase()}, ethical jewelry`
	}
}

export default async function CategoryMetalStylePage(props) {
	const params = await props.params
	const searchParams = await props.searchParams
	const { category, metal, style } = params

	if (!ALLOWED_CATEGORIES.includes(category)) notFound()
	if (!ALLOWED_METALS.includes(metal)) notFound()
	if (!ALLOWED_STYLES.includes(style)) notFound()

	// Fetch Contentful data with caching
	const content = await getCachedShopPageContent()

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
			<Suspense fallback={<ProductsSkeleton count={20} />}>
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
