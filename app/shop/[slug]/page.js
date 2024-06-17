// components
import Banner from '@/components/Banner'
import ProductInfo from '@/components/ProductInfo'
import FAQ from '@/components/FAQ'
import Products from '@/components/Products'

// lib
import { getProducts, getProduct } from '@/lib/shopify'

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

	return (
		<main>
			<ProductInfo product={product} />
			<FAQ />
			<Banner
				image
				center
				url='/sample-image1.jpg'
				title='Elevate your journey to forever.'
				text='Select up to three exquisite rings, delivered to your doorstep. Try them on, share the excitement, and choose the one that captures your heart. No pressure, just pure elegance.'
			/>
			<Products
				title='Pair your product with:'
				products={products.slice(0, 3)}
				threeColumn
			/>
		</main>
	)
}
