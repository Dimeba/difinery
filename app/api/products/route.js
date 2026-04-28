import { apolloClient } from '@/lib/apolloClient'
import { GET_PRODUCTS } from '@/lib/queries/getProducts'
import { NextResponse } from 'next/server'

export const revalidate = false
export const dynamic = 'force-dynamic' // Force dynamic rendering

export async function GET(request) {
	try {
		const url = new URL(request.url)
		const first = parseInt(url.searchParams.get('first') || '250')
		const after = url.searchParams.get('after') || null

		const { data } = await apolloClient.query({
			query: GET_PRODUCTS,
			variables: { first, after },
			context: {
				fetchOptions: {
					next: { revalidate: false }
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
