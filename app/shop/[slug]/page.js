// components
import ProductInfo from '@/components/ProductInfo'
import FAQ from '@/components/FAQ'
import Products from '@/components/Products'

// lib
import { getProducts, getProduct, getRecommendedProducts } from '@/lib/shopify'
import { getEntries } from '@/lib/contentful'
import { apolloClient } from '@/lib/apolloClient'
import { GET_PRODUCTS } from '@/lib/queries/getProducts'

const { data } = await apolloClient.query({
	query: GET_PRODUCTS
})

const products = data.products.edges.map(edge => edge.node)

// Products
export async function generateStaticParams() {
	return products.map(item => ({
		slug: item.handle
	}))
}

export async function generateMetadata({ params }) {
	const { slug } = params

	const id = products.find(product => product.handle === slug).id
	const product = await getProduct(id)

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

export default async function Product({ params }) {
	const { slug } = params

	const id = products.find(product => product.handle === slug).id
	const product = await getProduct(id)
	const serializedProduct = JSON.parse(JSON.stringify(product))

	// Recommended products
	const recommendedProducts = await getRecommendedProducts(id)

	return (
		<main>
			<ProductInfo product={serializedProduct} />

			<FAQ
				title='Frequently Asked Questions'
				productDetails={serializedProduct.description}
				content={faqs.fields.rows}
			/>

			{recommendedProducts.length > 0 && (
				<Products
					title='Pair your product with:'
					recommendedProducts={recommendedProducts.slice(0, 4)}
					type='recommended'
					showTitle
					individual={true}
				/>
			)}
		</main>
	)
}
