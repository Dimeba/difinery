// components
import ProductInfo from '@/components/ProductInfo'
import FAQ from '@/components/FAQ'
import Products from '@/components/Products'
import { Suspense } from 'react'

const ProductPageLayout = ({ product, recommendedProducts, faqs }) => {
	return (
		<main>
			<Suspense fallback={<div>Loading…</div>}>
				<ProductInfo product={product} />
			</Suspense>

			{recommendedProducts && recommendedProducts.length > 0 && (
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
		</main>
	)
}

export default ProductPageLayout
