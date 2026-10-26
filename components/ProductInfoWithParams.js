'use client'

import { useSearchParams } from 'next/navigation'
import ProductInfo from './ProductInfo'

// Reads ?gold= on the client. Render it inside <Suspense> with a plain
// <ProductInfo> as the fallback, so the prerendered HTML carries the full
// product (title, price, gallery, add to cart) instead of a skeleton.
const ProductInfoWithParams = props => {
	const gold = useSearchParams().get('gold')
	return <ProductInfo {...props} gold={gold} />
}

export default ProductInfoWithParams
