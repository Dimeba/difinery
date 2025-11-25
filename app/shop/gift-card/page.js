import { Suspense } from 'react'
import ProductInfo from '@/components/ProductInfo'

// lib
import { apolloClient } from '@/lib/apolloClient'
import { GET_PRODUCT_BY_HANDLE } from '@/lib/queries/getProductByHandle'

export const revalidate = 3600 // Revalidate every hour

export const metadata = {
	title: 'Difinery | Gift Card',
	description:
		'A one of a kind gift. Elegant, ethical, and entirely their choice. Redeemable toward any Difinery piece online.',
	keywords: 'Difinery, Gift Card, Jewelry'
}

export default async function GiftCard() {
	const { data } = await apolloClient.query({
		query: GET_PRODUCT_BY_HANDLE,
		variables: { handle: 'difinery-gift-card' },
		context: {
			fetchOptions: {
				next: { revalidate: 3600 } // Cache for 1 hour
			}
		}
	})

	const product = data.productByHandle

	return (
		<main>
			<Suspense fallback={<div>Loading…</div>}>
				<ProductInfo product={product} isGiftCard={true} />
			</Suspense>
		</main>
	)
}
