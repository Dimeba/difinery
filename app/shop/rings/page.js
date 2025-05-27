// components
import Products from '@/components/Products'

// data
import { apolloClient } from '@/lib/apolloClient'
import { GET_COLLECTION_BY_HANDLE } from '@/lib/queries/getCollectionByHandle'

export const metadata = {
	title: 'Difinery | Rings',
	description: '',
	keywords: ''
}

export default async function Home() {
	const fetchProducts = async handle => {
		const { data } = await apolloClient.query({
			query: GET_COLLECTION_BY_HANDLE,
			variables: { handle }
		})
		return data.collectionByHandle?.products?.edges.map(edge => edge.node) || []
	}

	const rings = await fetchProducts('rings')

	return (
		<main>
			<Products products={rings} showFilters />
		</main>
	)
}
