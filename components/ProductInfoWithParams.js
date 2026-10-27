'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ProductInfo from './ProductInfo'

// Reads ?gold= and ?charm= on the client. Render it inside <Suspense> with a
// plain <ProductInfo> as the fallback, so the prerendered HTML carries the
// full product instead of a skeleton. Banners can deep-link with ?charm=1
// to open the necklace builder immediately.
const ProductInfoWithParams = props => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const gold = searchParams.get('gold')
	const charm = searchParams.has('charm')

	const onOpenCharmMode = () => {
		const params = new URLSearchParams(searchParams.toString())
		params.set('charm', '1')
		const query = params.toString()
		router.push(`${pathname}${query ? `?${query}` : ''}`, { scroll: false })
		window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
	}

	return (
		<ProductInfo
			{...props}
			gold={gold}
			charm={charm}
			onOpenCharmMode={onOpenCharmMode}
		/>
	)
}

export default ProductInfoWithParams
