// components
import SmartProducts from '@/components/SmartProducts'
import PageContent from '@/components/PageContent'
import ProductsSkeleton from '@/components/ProductsSkeleton'
import { Suspense } from 'react'

// lib
import { fetchProductsSmart } from '@/lib/smartFetch'
import { getCachedShopPageContent } from '@/lib/cachedContentful'
import { notFound } from 'next/navigation'
import {
	getShareImageFromProducts,
	getSocialImageMetadata
} from '@/lib/shareImage'
import { apolloClient } from '@/lib/apolloClient'
import { GET_PRODUCTS } from '@/lib/queries/getProducts'
import { GET_COLLECTION_BY_HANDLE } from '@/lib/queries/getCollectionByHandle'

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
	'wedding-bands',
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

export const revalidate = false

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

	// Use a small fetch (first: 3) just for the OG image — avoids full paginated
	// dataset fetches during static generation which caused build timeouts.
	let shareImage = null
	try {
		const queryOptions =
			category === 'all'
				? {
						query: GET_PRODUCTS,
						variables: { first: 3, after: null },
						context: { fetchOptions: { next: { revalidate: false } } }
					}
				: {
						query: GET_COLLECTION_BY_HANDLE,
						variables: { handle: category, first: 3, after: null },
						context: { fetchOptions: { next: { revalidate: false } } }
					}
		const { data } = await apolloClient.query(queryOptions)
		const edges =
			category === 'all'
				? (data.products?.edges ?? [])
				: (data.collectionByHandle?.products?.edges ?? [])
		const previewProducts = edges.map(edge => edge.node)
		shareImage = getShareImageFromProducts(previewProducts)
	} catch (_) {
		// Non-critical: OG image simply won't be set if fetch fails
	}

	return {
		title: `Difinery | ${titleCase}`,
		description,
		keywords: `lab-grown diamonds, ${titleCase.toLowerCase()}, ${metalLabel.toLowerCase()}, ethical jewelry`,
		...getSocialImageMetadata(shareImage)
	}
}

export default async function CategoryMetalStylePage(props) {
	const params = await props.params
	const { category, metal, style } = params

	if (!ALLOWED_CATEGORIES.includes(category)) notFound()
	if (!ALLOWED_METALS.includes(metal)) notFound()
	if (!ALLOWED_STYLES.includes(style)) notFound()

	// Fetch Contentful data with caching
	const content = await getCachedShopPageContent()

	// Extract filters from URL path and query parameters
	const currentFilters = {
		metal: metal, // Metal comes from URL path
		style: style !== 'all' ? style : null // Style from URL path (null if 'all')
	}

	// At build time, always fetch only 20 products regardless of style filter.
	// SmartProducts detects active filters on mount and fetches the full dataset
	// client-side, so pre-fetching 250 products per filtered page during SSG
	// is redundant and causes Netlify build timeouts (195 heavy API calls).
	const { edges, pageInfo } = await fetchProductsSmart({ metal }, category)

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
