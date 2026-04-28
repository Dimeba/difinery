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

export const revalidate = false

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

	// This should never be reached due to middleware redirect
	// Keeping as fallback
	const { redirect } = await import('next/navigation')
	redirect(`/shop/all/${metal}/all`)
}
