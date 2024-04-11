// components
import Banner from '@/components/Banner'
import Features from '@/components/Features'

export default function Home() {
	return (
		<main>
			<Banner video center url='/sample-video.mp4' />
			<Banner image center url='/sample-image.jpg' />
			<Banner video center url='/sample-video.mp4' />
			<Features />
		</main>
	)
}
