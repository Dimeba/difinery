export const dynamic = 'force-dynamic'

// components
import ProductInfo from '@/components/ProductInfo'
import FAQ from '@/components/FAQ'
import Products from '@/components/Products'

// lib
import { getProducts, getProduct, getRecommendedProducts } from '@/lib/shopify'

const products = await getProducts()

export async function generateStaticParams() {
	return products.map(item => ({
		slug: item.handle
	}))
}

export default async function Product({ params }) {
	const { slug } = params

	const products = await getProducts()

	const id = products.find(product => product.handle === slug).id
	const product = await getProduct(id)
	const serializedProduct = JSON.parse(JSON.stringify(product))

	// Recommended products
	const recommendedProducts = await getRecommendedProducts(id)

	return (
		<main>
			<ProductInfo product={serializedProduct} />
			<FAQ />

			{recommendedProducts.length > 0 && (
				<Products
					title='Pair your product with:'
					recommendedProducts={recommendedProducts.slice(0, 4)}
					type='recommended'
					showTitle
				/>
			)}
		</main>
	)
}
