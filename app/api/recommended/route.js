import { NextResponse } from 'next/server'
import { apolloClient } from '@/lib/apolloClient'
import { GET_PRODUCTS } from '@/lib/queries/getProducts'

export const dynamic = 'force-dynamic'
export const revalidate = false

export async function GET(request) {
	const { searchParams } = new URL(request.url)
	const ids = searchParams.get('ids')

	if (!ids) {
		return NextResponse.json({ error: 'Product IDs required' }, { status: 400 })
	}

	const productIds = ids.split(',')

	try {
		// Fetch all products
		const { data } = await apolloClient.query({
			query: GET_PRODUCTS,
			variables: { first: 250, after: null },
			context: {
				fetchOptions: {
					next: { revalidate: false }
				}
			}
		})

		const allProducts = data.products.edges.map(edge => edge.node)
		const recommendedProducts = allProducts.filter(product =>
			productIds.includes(product.id)
		)

		return NextResponse.json(
			{ products: recommendedProducts },
			{
				headers: {
					'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
				}
			}
		)
	} catch (error) {
		console.error('Error fetching recommended products:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch products' },
			{ status: 500 }
		)
	}
}
