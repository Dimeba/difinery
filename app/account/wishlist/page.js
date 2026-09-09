import Link from 'next/link'

import { customerFetch } from '@/lib/customerAccount/client'
import { CUSTOMER_WISHLIST } from '@/lib/customerAccount/queries'
import { formatMoney } from '@/lib/customerAccount/format'
import { PRODUCTS_BY_IDS, storefrontFetch } from '@/lib/storefrontServer'
import WishlistButton from '@/components/WishlistButton'

import styles from '../Account.module.scss'

export const dynamic = 'force-dynamic'

function parseIds(value) {
	if (!value) return []
	try {
		const parsed = JSON.parse(value)
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

// Products land in whatever category folder the shop routes use; the PDP path
// needs one, so fall back to the catch-all "all" segment.
function productHref(product) {
	const category = product.category?.name?.toLowerCase().replace(/\s+/g, '-')
	return `/shop/${category || 'all'}/product/${product.handle}`
}

export default async function WishlistPage() {
	const data = await customerFetch(CUSTOMER_WISHLIST)
	const ids = parseIds(data?.customer?.metafield?.value)

	let products = []
	if (ids.length) {
		try {
			const result = await storefrontFetch(PRODUCTS_BY_IDS, { ids })
			// `nodes` returns null for products that were deleted or unpublished.
			products = (result?.nodes || []).filter(Boolean)
		} catch (error) {
			console.error('Failed to load wishlist products:', error.message)
		}
	}

	return (
		<>
			<h1 className={styles.pageTitle}>Wishlist</h1>
			<p className={styles.pageIntro}>
				Pieces you&apos;ve saved. They stay here across devices.
			</p>

			{products.length === 0 ? (
				<div className={styles.empty}>
					<p>Nothing saved yet. Tap the heart on any piece to keep it here.</p>
					<Link
						href='/shop/all/yellow-gold/all'
						className={`${styles.button} ${styles.buttonPrimary}`}
						style={{ marginTop: '1.5rem' }}
					>
						Browse the collection
					</Link>
				</div>
			) : (
				<div className={styles.productGrid}>
					{products.map(product => {
						const image = product.images?.edges?.[0]?.node
						return (
							<div key={product.id} className={styles.productCard}>
								<Link href={productHref(product)}>
									{image?.url ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={image.url}
											alt={image.altText || product.title}
											className={styles.productImage}
										/>
									) : (
										<div className={styles.productImage} />
									)}
								</Link>

								<div>
									<Link href={productHref(product)}>
										<p className={styles.orderName}>{product.title}</p>
									</Link>
									<p className={styles.muted}>
										{formatMoney(product.priceRange?.minVariantPrice)}
										{!product.availableForSale && ' · Sold out'}
									</p>
								</div>

								<WishlistButton
									productId={product.id}
									variant='text'
									refreshOnChange
								/>
							</div>
						)
					})}
				</div>
			)}
		</>
	)
}
