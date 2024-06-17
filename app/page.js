// components
import Hero from '@/components/Hero'
import Banner from '@/components/Banner'
import Features from '@/components/Features'
import Products from '@/components/Products'

// lib
import { getCategories } from '@/lib/commerce'
import { getProducts, getCollections } from '@/lib/shopify'

export default async function Home() {
	const categories = await getCategories()

	const collections = await getCollections()

	console.log(collections[1].title)

	return (
		<main>
			<Hero />
			<Banner
				button1Text='Learn More'
				button1Url='#'
				button2Text='Shop Now'
				button2Url='/shop'
				video
				center
				url='/sample-video.mp4'
				title='Sustainable Luxury'
				text='We hold ourselves accountable for continuously minimizing our environmental footprint while providing premium quality jewelry that redefines forever.'
			/>
			<Banner
				button1Text='Learn More'
				button1Url='#'
				image
				center
				url='/sample-image.jpg'
				title='Ethical. Elegant. Ethereal'
			/>
			<Banner
				button1Text='Learn More'
				button1Url='#'
				button2Text='Shop Now'
				button2Url='/shop'
				video
				center
				url='/sample-video.mp4'
				title='Find timeless elegance in every piece.'
				text='Sustainable and ethically-crafted fine jewelry is our essence. We are committed to fair value and a fair future. To us, forever is not just about every piece of jewelry lasting forever, but contributing to a forever future for our  planet, and its people.'
			/>
			<Features />
			<Products title='Shop by Category' categories={collections} />
		</main>
	)
}
