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

export const revalidate = false

export async function generateStaticParams() {
	return ALLOWED_CATEGORIES.map(category => ({ category }))
}

export async function generateMetadata(props) {
	const params = await props.params
	const { category } = params
	if (!ALLOWED_CATEGORIES.includes(category))
		return {
			title: 'Difinery | Shop',
			description:
				'Shop elegant, ethical lab-grown diamond jewelry at Difinery.'
		}
	const titleCase = category.charAt(0).toUpperCase() + category.slice(1)
	return {
		title: `Difinery | ${titleCase}`,
		description: `Shop ${titleCase} in yellow gold, white gold, and rose gold. Elegant, ethical lab-grown diamond jewelry by Difinery.`,
		keywords: `lab-grown diamonds, ${category}, ethical jewelry, difinery`
	}
}

export default async function CategoryPage(props) {
	const params = await props.params
	const { category } = params

	if (!ALLOWED_CATEGORIES.includes(category)) notFound()

	// This should never be reached due to middleware redirect
	// Keeping as fallback
	const { redirect } = await import('next/navigation')
	redirect(`/shop/${category}/yellow-gold/all`)
}
