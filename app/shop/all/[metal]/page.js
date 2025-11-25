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

export const revalidate = 3600 // Revalidate every hour

export async function generateStaticParams() {
	return ALLOWED_METALS.map(metal => ({ metal }))
}

export const metadata = {
	title: 'Difinery | Shop',
	description: '',
	keywords: ''
}

export default async function ShopAllPage(props) {
	const params = await props.params
	const { metal } = params

	if (!ALLOWED_METALS.includes(metal)) notFound()

	// Redirect to 'all' style by default for SEO-friendly URLs
	const { redirect } = await import('next/navigation')
	redirect(`/shop/all/${metal}/all`)
}
