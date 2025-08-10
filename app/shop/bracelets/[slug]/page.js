import ProductPageLayout from '@/components/ProductPageLayout'

// lib
import { getEntries } from '@/lib/contentful'
import { apolloClient } from '@/lib/apolloClient'
import { GET_PRODUCTS } from '@/lib/queries/getProducts'
import { GET_PRODUCT_BY_HANDLE } from '@/lib/queries/getProductByHandle'
import { notFound } from 'next/navigation'

const { data } = await apolloClient.query({
	query: GET_PRODUCTS,
	variables: {
		first: 250,
		after: null
	}
})

const products = data.products.edges.map(edge => edge.node)

// Products
export async function generateStaticParams() {
	return products.map(item => ({
		slug: item.handle
	}))
}

export async function generateMetadata(props) {
	const params = await props.params
	const { slug } = params

	const { data } = await apolloClient.query({
		query: GET_PRODUCT_BY_HANDLE,
		variables: { handle: slug }
	})
	const product = data.productByHandle

	if (!product) {
		return { title: 'Difinery | Product not found' }
	}

	return {
		title: 'Difinery | ' + product.title,
		description: product.description ? product.description : ''
	}
}

// FAQs
const allFaqs = await getEntries('accordion')
const faqs = allFaqs.items.find(item => item.fields.productPage === 'Yes') || {
	fields: { rows: [] }
}

export default async function Product(props) {
	const params = await props.params
	const { slug } = params

	const { data } = await apolloClient.query({
		query: GET_PRODUCT_BY_HANDLE,
		variables: { handle: slug }
	})
	const product = data.productByHandle
	if (!product) {
		notFound()
	}

	// Recommended products (guard metafield)
	let recommendedProducts = []
	if (product.metafield?.value) {
		const recommendedProductIds = product.metafield.value
		recommendedProducts = products.filter(item =>
			recommendedProductIds.includes(item.id)
		)
	}

	return (
		<ProductPageLayout
			product={product}
			recommendedProducts={recommendedProducts}
			faqs={faqs}
		/>
	)
}
