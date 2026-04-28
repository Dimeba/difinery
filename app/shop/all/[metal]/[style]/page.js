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

export const revalidate = false

export async function generateStaticParams() {
	return ALLOWED_METALS.flatMap(metal =>
		ALLOWED_STYLES.map(style => ({ metal, style }))
	)
}

export async function generateMetadata(props) {
	const params = await props.params
	const { metal, style } = params

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
		? `Shop ${styleLabel} in ${metalLabel}. Elegant, ethical lab-grown diamond jewelry by Difinery.`
		: `Shop ${metalLabel} jewelry. Elegant, ethical lab-grown diamond jewelry by Difinery.`

	const previewFilters = {
		metal,
		style: style !== 'all' ? style : null,
		shape: null,
		setting: null
	}
	const { edges } = await fetchProductsSmart(previewFilters, 'all')
	const previewProducts = edges.map(edge => edge.node)
	const shareImage = getShareImageFromProducts(previewProducts)

	return {
		title: 'Difinery | Shop',
		description,
		keywords: `lab-grown diamonds, ${metalLabel.toLowerCase()}, ethical jewelry, difinery`,
		...getSocialImageMetadata(shareImage)
	}
}

export default async function ShopAllMetalStylePage(props) {
	const params = await props.params
	const { metal, style } = params

	if (!ALLOWED_METALS.includes(metal)) notFound()
	if (!ALLOWED_STYLES.includes(style)) notFound()

	// Fetch Contentful data with caching
	const content = await getCachedShopPageContent()

	// Extract filters from URL path and query parameters
	const currentFilters = {
		metal: metal, // Metal comes from URL path
		style: style !== 'all' ? style : null // Style from URL path (null if 'all')
	}

	// Smart fetch: 20 products if no filters, 250 if filters active
	const { edges, pageInfo } = await fetchProductsSmart(currentFilters, 'all')

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
					productType='all'
					selectedMetalType={metalLabel}
					showFilters
					filters={currentFilters}
					category='all'
				/>
			</Suspense>
			<PageContent content={content} />
		</main>
	)
}
