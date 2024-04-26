// components
import Banner from '@/components/Banner'
import ProductInfo from '@/components/ProductInfo'
import FAQ from '@/components/FAQ'
import Products from '@/components/Products'

// lib
import { getProducts, getProduct } from '@/lib/commerce'

const products = await getProducts()

export async function generateStaticParams() {
	return products.map(item => ({
		slug: item.permalink
	}))
}

export default async function Product({ params }) {
	const { slug } = params

	const product = await getProduct(slug)
	const products = await getProducts()

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
