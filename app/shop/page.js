import ProductsPlaceholder from '@/components/ProductsPlaceholder'
import { apolloClient } from '@/lib/apolloClient'
import { GET_PRODUCTS } from '@/lib/queries/getProducts'
import {
	getShareImageFromProducts,
	getSocialImageMetadata
} from '@/lib/shareImage'

export async function generateMetadata() {
	const { data } = await apolloClient.query({
		query: GET_PRODUCTS,
		variables: { first: 20, after: null },
		context: {
			fetchOptions: {
				next: { revalidate: 3600 }
			}
		}
	})
	const previewProducts = data.products.edges.map(edge => edge.node)
	const shareImage = getShareImageFromProducts(previewProducts)

	return {
		title: 'Difinery | Shop',
		description:
			'Shop elegant, ethical lab-grown diamond jewelry. Rings, necklaces, earrings, and bracelets in yellow gold, white gold, and rose gold.',
		keywords:
			'lab-grown diamonds, ethical jewelry, diamond rings, diamond necklaces, diamond earrings, diamond bracelets, difinery',
		...getSocialImageMetadata(shareImage)
	}
}

export default function Home() {
	return <ProductsPlaceholder />
}
