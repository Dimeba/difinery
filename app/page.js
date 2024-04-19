// components
import Hero from '@/components/Hero'
import Banner from '@/components/Banner'
import Features from '@/components/Features'
import Categories from '@/components/Categories'

// lib
import { categories, products, getProductsInCategory } from '@/lib/commerce'

export default async function Home() {
	// console.log(products[0].categories[0].name)

	const selectedProducts = await getProductsInCategory(categories[3].slug)

	console.log(selectedProducts)

	return (
		<main>
			<Hero />
			<Banner video center url='/sample-video.mp4' />
			<Banner image center url='/sample-image.jpg' />
			<Banner video center url='/sample-video.mp4' />
			<Features />
			<Categories categories={categories} />
		</main>
	)
}
