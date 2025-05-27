// components
import ProductInfo from '@/components/ProductInfo'
import FAQ from '@/components/FAQ'
import Products from '@/components/Products'

// lib
import { getEntries } from '@/lib/contentful'
import { apolloClient } from '@/lib/apolloClient'
import { GET_PRODUCTS } from '@/lib/queries/getProducts'
import { GET_PRODUCT_BY_HANDLE } from '@/lib/queries/getProductByHandle'
import { GET_PRODUCT_RECOMMENDATIONS } from '@/lib/queries/getProductRecommendations'

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

export async function generateMetadata(props) {
    const params = await props.params;
    const { slug } = params

    const { data } = await apolloClient.query({
		query: GET_PRODUCT_BY_HANDLE,
		variables: { handle: slug }
	})
    const product = data.productByHandle

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
    const params = await props.params;
    const { slug } = params

    const { data } = await apolloClient.query({
		query: GET_PRODUCT_BY_HANDLE,
		variables: { handle: slug }
	})
    const product = data.productByHandle

    // Recommended products
    const { data: recommendationsData } = await apolloClient.query({
		query: GET_PRODUCT_RECOMMENDATIONS,
		variables: { productHandle: slug }
	})

    const recommendedProducts = recommendationsData.productRecommendations

    return (
		<main>
			<ProductInfo product={product} />

			<FAQ
				title='Frequently Asked Questions'
				productDetails={product.description}
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
