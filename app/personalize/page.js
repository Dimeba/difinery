// components
import Banner from '@/components/Banner'
import Features from '@/components/Features'
import ColumnsContent from '@/components/ColumnsContent'

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
			<ColumnsContent
				title='Engraving'
				text="Add a personal touch with our free engraving service. Whether it's initials, a date, or a special message, we meticulously engrave your wishes to give your jewelry unique meaning and significance."
				buttonText='Personalize Now'
				buttonUrl='#'
				image='/sample-image.jpg'
			/>
			<ColumnsContent
				reverse
				title='Craft your story '
				text='Personalize your jewelry with names, dates, or words that matter most to you. Elevate your style - create a charm that speaks your unique language.'
				buttonText='Learn More'
				buttonUrl='#'
				image='/sample-image1.jpg'
			/>
			<ColumnsContent
				title='Sketch Craft'
				text='Seamlessly upload your sketches, and watch as our cutting-edge technology transforms your ideas into meticulously crafted, one-of-a-kind pieces. Your design, our precision - redefine personalized jewelry with the click of a button.'
				buttonText='EXPLORE CUSTOM MADE JEWELRY'
				buttonUrl='#'
				image='/sample-image2.jpg'
			/>
			<Features />
		</main>
	)
}
