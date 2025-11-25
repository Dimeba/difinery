import { apolloClient } from '@/lib/apolloClient'
import { GET_PRODUCTS } from '@/lib/queries/getProducts'
import { NextResponse } from 'next/server'

export const revalidate = 3600 // Revalidate every hour

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url)
		const first = parseInt(searchParams.get('first') || '250')
		const after = searchParams.get('after') || null

		const { data } = await apolloClient.query({
			query: GET_PRODUCTS,
			variables: { first, after },
			context: {
				fetchOptions: {
					next: { revalidate: 3600 } // Cache for 1 hour
				}
			}
		})

		return NextResponse.json({
			edges: data.products.edges,
			pageInfo: data.products.pageInfo
		})
	} catch (error) {
		console.error('Error fetching products:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch products' },
			{ status: 500 }
		)
	}
}
