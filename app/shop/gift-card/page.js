import { Suspense } from 'react'
import ProductInfo from '@/components/ProductInfo'
import ProductInfoWithParams from '@/components/ProductInfoWithParams'

// lib
import { apolloClient } from '@/lib/apolloClient'
import { GET_PRODUCT_BY_HANDLE } from '@/lib/queries/getProductByHandle'
import {
	getShareImageFromProduct,
	getSocialImageMetadata
} from '@/lib/shareImage'

export const revalidate = false

export async function generateMetadata() {
	const { data } = await apolloClient.query({
		query: GET_PRODUCT_BY_HANDLE,
		variables: { handle: 'difinery-gift-card' },
		context: {
			fetchOptions: {
				next: { revalidate: false }
			}
		}
	})

	const product = data.productByHandle
	const shareImage = getShareImageFromProduct(product)

	return {
		title: 'Difinery | Gift Card',
		description:
			'A one of a kind gift. Elegant, ethical, and entirely their choice. Redeemable toward any Difinery piece online.',
		keywords: 'Difinery, Gift Card, Jewelry',
		...getSocialImageMetadata(shareImage, { path: '/shop/gift-card' })
	}
}

export default async function GiftCard() {
	const { data } = await apolloClient.query({
		query: GET_PRODUCT_BY_HANDLE,
		variables: { handle: 'difinery-gift-card' },
		context: {
			fetchOptions: {
				next: { revalidate: false }
			}
		}
	})

	const product = data.productByHandle

	return (
		<main>
			<Suspense fallback={<ProductInfo product={product} isGiftCard={true} />}>
				<ProductInfoWithParams product={product} isGiftCard={true} />
			</Suspense>
		</main>
	)
}
