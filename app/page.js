// components
import Hero from '@/components/Hero'
import Banner from '@/components/Banner'
import Features from '@/components/Features'
import Products from '@/components/Products'

// lib
import { getCollections } from '@/lib/shopify'

// contentful
import { createClient } from 'contentful'

export default async function Home() {
	// Shopify
	const collections = await getCollections()

	// Contentful
	const client = createClient({
		space: process.env.space,
		accessToken: process.env.accessToken
	})

	const homepage = await client.getEntries({
		content_type: 'homepage'
	})

	const content = homepage.items[0].fields

	return (
		<main>
			<Hero
				title={content.heroTitle}
				text={content.heroText}
				image={content.heroImage.fields.file.url}
			/>
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
