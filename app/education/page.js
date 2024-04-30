// components
import Banner from '@/components/Banner'
import ColumnsContent from '@/components/ColumnsContent'
import SimpleRow from '@/components/SimpleRow'

export default async function Education() {
	return (
		<main>
			<Banner
				button1Text='Discover Our Collection'
				button1Url='#'
				button2Text='Shop Now'
				button2Url='/shop'
				video
				center
				url='/sample-video.mp4'
				title='Sustainable Luxury'
				text='We hold ourselves accountable for continuously minimizing our environmental footprint while providing premium quality jewelry that redefines forever.'
			/>
			<SimpleRow
				title='Adorning a Better World'
				text="At Adorina, sustainability isn't just a response to trends; it is a holistic ethos guiding every decision, and action. We are committed to zero-waste, carbon-neutral operations, and our transparent supply chain ensures that you can feel proud wearing jewels that tread lightly on our planet, and people."
			/>
			<ColumnsContent
				title='A cycle of creation'
				text='Our diamonds are a brilliant union of innovation and sustainability. Chemically identical to mined diamonds, our lab-grown gems provide the same eternal radiance without the ecological burden of mining.'
				image='/sample-image.jpg'
			/>
			<ColumnsContent
				reverse
				title='The science behind stunning diamonds'
				text="To be the leading online destination for sustainable luxury jewelry that lasts forever - both in quality and positive global impact. Adorina's ethical sourcing, innovative recycled materials, and give-back model contribute to a future of inclusion, empowerment, and environmental restoration."
				image='/sample-image1.jpg'
			/>
			<SimpleRow title='Learn more about sustainably created diamonds' />
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
			<Banner
				image
				center
				url='/sample-image1.jpg'
				title='Find Your Size'
				text='With this ring size calculator, let your hands effortlessly hold the gaze of the world, with a lot more grace and beauty.'
				button1Text='Find'
				button1Url='#'
			/>
		</main>
	)
}
