import { apolloClient } from '@/lib/apolloClient'
import { GET_COLLECTION_BY_HANDLE } from '@/lib/queries/getCollectionByHandle'
import { NextResponse } from 'next/server'

export const revalidate = false
export const dynamic = 'force-dynamic' // Force dynamic rendering

export async function GET(request, { params }) {
	try {
		const { handle } = await params
		const url = new URL(request.url)
		const first = parseInt(url.searchParams.get('first') || '250')
		const after = url.searchParams.get('after') || null

		const { data } = await apolloClient.query({
			query: GET_COLLECTION_BY_HANDLE,
			variables: { handle, first, after },
			context: {
				fetchOptions: {
					next: { revalidate: false }
				}
			}
		})

		if (!data.collectionByHandle) {
			return NextResponse.json(
				{ error: 'Collection not found' },
				{ status: 404 }
			)
		}

		return NextResponse.json({
			products: {
				edges: data.collectionByHandle.products.edges,
				pageInfo: data.collectionByHandle.products.pageInfo
			}
		})
	} catch (error) {
		console.error('Error fetching collection:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch collection' },
			{ status: 500 }
		)
	}
}
