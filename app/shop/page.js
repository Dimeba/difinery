// components
import Banner from '@/components/Banner'
import Features from '@/components/Features'
import Products from '@/components/Products'

// lib
import { getProducts } from '@/lib/commerce'

export default async function Shop() {
	const products = await getProducts()

	return (
		<main>
			<Banner
				image
				center
				url='/sample-image1.jpg'
				title='Sustainable and ethically-crafted fine jewelry is our essence.'
				text='We are committed to fair value and a fair future.
				To us, forever is not just about every piece of jewelry lasting forever, 
				but contributing to a forever future for our planet, and its people.'
			/>
			<Products products={products} />
			<Banner
				button1Text='Elevate your journey to forever'
				button1Url='#'
				image
				center
				url='/sample-image1.jpg'
				title='Elevate your journey to forever.'
				text='Select up to three exquisite rings, delivered to your doorstep. Try them on, share the excitement, and choose the one that captures your heart. No pressure, just pure elegance.'
			/>
			<Features />
			<Banner
				button1Text='Shop Now'
				button1Url='#'
				image
				center
				url='/sample-image1.jpg'
				title='We guide you to your perfect gift.'
				text='Ethical. Sustainable. Forever gift.'
			/>
		</main>
	)
}
