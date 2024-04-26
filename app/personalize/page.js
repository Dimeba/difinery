// components
import Banner from '@/components/Banner'
import Features from '@/components/Features'

export default async function Personalize() {
	return (
		<main>
			<Banner
				image
				center
				url='/sample-image1.jpg'
				title='Effortless Sophistication'
				text='We obsess over intuitive, customer-centered design, to provide a seamless customer experience across every brand touchpoint, from exploration to unboxing.'
			/>
			<Features />
		</main>
	)
}
