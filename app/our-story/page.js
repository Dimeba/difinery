// components
import Banner from '@/components/Banner'
import Materials from '@/components/Materials'

export default async function OurStory() {
	return (
		<main>
			<Banner top video center url='/sample-video.mp4' showControls />

			<Materials />

			<Banner
				image
				center
				url='/sample-image2.jpg'
				title='Empowered Impact'
				text='We believe in reciprocal giving - as our brand grows, so does our ability to create real positive change in communities.'
				button1Text='Discover Our Collection'
				button1Url='#'
				button2Text='Shop Now'
				button2Url='/shop'
			/>
		</main>
	)
}
