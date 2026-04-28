import { apolloClient } from '@/lib/apolloClient'
import { GET_PRODUCT_BY_HANDLE } from '@/lib/queries/getProductByHandle'
import { NextResponse } from 'next/server'

export const revalidate = false
export const dynamic = 'force-dynamic' // Force dynamic rendering

export async function GET(request, { params }) {
	try {
		const { handle } = await params

		const { data } = await apolloClient.query({
			query: GET_PRODUCT_BY_HANDLE,
			variables: { handle },
			context: {
				fetchOptions: {
					next: { revalidate: false }
				}
			}
		})

		if (!data.productByHandle) {
			return NextResponse.json({ error: 'Product not found' }, { status: 404 })
		}

		return NextResponse.json(data.productByHandle)
	} catch (error) {
		console.error('Error fetching product:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch product' },
			{ status: 500 }
		)
	}
}
