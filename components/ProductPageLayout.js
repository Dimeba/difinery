// components
import ProductInfo from '@/components/ProductInfo'
import ProductInfoWithParams from '@/components/ProductInfoWithParams'
import FAQ from '@/components/FAQ'
import Products from '@/components/Products'
import SpecialRequestBanner from '@/components/SpecialRequestBanner'
import { Suspense } from 'react'
import { isBezelPendantProduct } from '@/lib/charmNecklace'

const ProductPageLayout = ({ product, recommendedProducts, faqs }) => {
	const showPairWith =
		recommendedProducts &&
		recommendedProducts.length > 0 &&
		!isBezelPendantProduct(product)

	return (
		<main>
			{/* The fallback is what gets prerendered: the full product without the
			    ?gold= preselection, which is applied once the client takes over. */}
			<Suspense fallback={<ProductInfo product={product} />}>
				<ProductInfoWithParams product={product} />
			</Suspense>

			{showPairWith && (
				<Products
					title='Pair your product with:'
					recommendedProducts={recommendedProducts.slice(0, 4)}
					type='recommended'
					showTitle
					individual={true}
				/>
			)}

			<div style={{ marginTop: '4rem' }}></div>
			{/* 
			<FAQ
				title='Frequently Asked Questions'
				productDetails={product.description}
				content={faqs.fields.rows}
			/> */}

			<SpecialRequestBanner />
		</main>
	)
}

export default ProductPageLayout
