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

export const revalidate = 3600 // Revalidate every hour

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

	// Redirect to yellow-gold/all by default for SEO-friendly URLs
	const { redirect } = await import('next/navigation')
	redirect(`/shop/${category}/yellow-gold/all`)
}
