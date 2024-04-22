// components
import Hero from '@/components/Hero'
import Banner from '@/components/Banner'
import Features from '@/components/Features'
import Products from '@/components/Products'

// lib
import { getCategories } from '@/lib/commerce'

export default async function Home() {
	const categories = await getCategories()

	return (
		<main>
			<Hero />
			<Banner
				button1Text='Learn More'
				button1Url='#'
				button2Text='Shop Now'
				button2Url='#'
				video
				center
				url='/sample-video.mp4'
			/>
			<Banner
				button1Text='Learn More'
				button1Url='#'
				image
				center
				url='/sample-image.jpg'
			/>
			<Banner
				button1Text='Learn More'
				button1Url='#'
				button2Text='Shop Now'
				button2Url='#'
				video
				center
				url='/sample-video.mp4'
			/>
			<Features />
			<Products title='Shop by Category' categories={categories} />
		</main>
	)
}
