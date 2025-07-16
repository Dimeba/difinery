// components
import ProductInfo from '@/components/ProductInfo'
import FAQ from '@/components/FAQ'
import Products from '@/components/Products'

const ProductPageLayout = ({ product, recommendedProducts, faqs }) => {
	return (
		<main>
			<ProductInfo product={product} />

			{recommendedProducts.length > 0 && (
				<Products
					title='Pair your product with:'
					recommendedProducts={recommendedProducts.slice(0, 4)}
					type='recommended'
					showTitle
					individual={true}
				/>
			)}
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
