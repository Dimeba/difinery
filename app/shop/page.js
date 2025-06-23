// components
import Products from '@/components/Products'
import PageContent from '@/components/PageContent'

// lib
import { apolloClient } from '@/lib/apolloClient'
import { GET_COLLECTION_BY_HANDLE } from '@/lib/queries/getCollectionByHandle'
import { getEntries } from '@/lib/contentful'

// Contentful
const pages = await getEntries('page')
const content = pages.items.find(page => page.fields.title == 'Shop').fields

export const metadata = {
	title: 'Difinery | Shop',
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
	const earrings = await fetchProducts('earrings')
	const necklaces = await fetchProducts('necklaces')
	const bracelets = await fetchProducts('bracelets')

	const allProducts = [
		...rings,
		...earrings,
		...necklaces,
		...bracelets
	].reverse()

	return (
		<main>
			<Products products={allProducts} showFilters />
			<PageContent content={content} />
		</main>
	)
}
