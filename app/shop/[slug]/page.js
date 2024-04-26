// components
import Banner from '@/components/Banner'
import ProductInfo from '@/components/ProductInfo'
import FAQ from '@/components/FAQ'

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
		</main>
	)
}
