// components
import Hero from '@/components/Hero'
import Banner from '@/components/Banner'
import Features from '@/components/Features'
import Categories from '@/components/Categories'

export default function Home() {
	return (
		<main>
			<Hero />
			<Banner video center url='/sample-video.mp4' />
			<Banner image center url='/sample-image.jpg' />
			<Banner video center url='/sample-video.mp4' />
			<Features />
			<Categories />
		</main>
	)
}
