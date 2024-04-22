// components
import Hero from '@/components/Hero'
import Banner from '@/components/Banner'
import Features from '@/components/Features'
import Products from '@/components/Products'

// lib
import { categories, products, getProductsInCategory } from '@/lib/commerce'

export default async function Home() {
	return (
		<main>
			<Banner image center url='/sample-image1.jpg' />
			<Products products={products} />
			<Banner
				button1Text='Elevate your journey to forever'
				button1Url='#'
				image
				center
				url='/sample-image1.jpg'
			/>
			<Features />
			<Banner
				button1Text='Shop Now'
				button1Url='#'
				image
				center
				url='/sample-image1.jpg'
			/>
		</main>
	)
}
