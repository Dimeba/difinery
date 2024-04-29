// components
import SaleHero from '@/components/SaleHero'
import Collections from '@/components/Collections'
import Banner from '@/components/Banner'
import ColumnsContent from '@/components/ColumnsContent'
import Products from '@/components/Products'
import Features from '@/components/Features'

// lib
import { getProducts } from '@/lib/commerce'

export default async function Sale() {
	const products = await getProducts()

	return (
		<main>
			<SaleHero products={products.slice(0, 2)} />

			<Collections />

			<Products
				products={products}
				showPrice
				title='Elevated savings on exquisite pieces'
				discount
			/>

			<ColumnsContent
				title='Complimentary Engraving Service'
				text='Unlock a personal touch with our complimentary engraving service. Elevate your jewelry with a unique inscription, on us.'
				image='/sample-image.jpg'
				buttonText='Shop Gifts'
				buttonUrl='#'
			/>

			<Features />

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
