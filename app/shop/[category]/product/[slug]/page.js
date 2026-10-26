import ProductPageLayout from '@/components/ProductPageLayout'
import JsonLd from '@/components/JsonLd'

// lib
import { getCachedProductFAQs } from '@/lib/cachedContentful'
import { apolloClient } from '@/lib/apolloClient'
import { Suspense } from 'react'
import { GET_PRODUCTS } from '@/lib/queries/getProducts'
import { GET_PRODUCT_BY_HANDLE } from '@/lib/queries/getProductByHandle'
import { notFound, permanentRedirect } from 'next/navigation'
import {
	getShareImageFromProduct,
	getSocialImageMetadata
} from '@/lib/shareImage'
import { isCharmCopyProduct } from '@/lib/charmNecklace'
import { productCategorySlug, productPath } from '@/lib/productUrl'
import { productJsonLd, breadcrumbJsonLd } from '@/lib/structuredData'

export const revalidate = false

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

// Storefront can return an empty payload when many product pages prerender
// at once. Retry, then let the page render as not-found instead of crashing.
async function fetchProductByHandle(handle) {
	for (let attempt = 0; attempt < 4; attempt++) {
		try {
			const result = await apolloClient.query({
				query: GET_PRODUCT_BY_HANDLE,
				variables: { handle },
				fetchPolicy: attempt === 0 ? 'cache-first' : 'network-only',
				errorPolicy: 'all',
				context: {
					fetchOptions: {
						next: { revalidate: false }
					}
				}
			})
			const product = result?.data?.productByHandle
			if (product) return product
		} catch {
			// Try again. The last miss falls through to not-found.
		}
		if (attempt < 3) await sleep(400 * (attempt + 1))
	}
	return null
}

// Generate static params for all products
export async function generateStaticParams() {
	const { data } = await apolloClient.query({
		query: GET_PRODUCTS,
		variables: { first: 250, after: null }
	})

	const products = (data?.products?.edges || [])
		.map(edge => edge.node)
		.filter(product => !isCharmCopyProduct(product))

	// Only each product's canonical URL is prebuilt; any other category
	// segment redirects there (see below).
	return products.flatMap(product => {
		const category = productCategorySlug(product)
		return category ? [{ category, slug: product.handle }] : []
	})
}

export async function generateMetadata(props) {
	const params = await props.params
	const { slug } = params

	const product = await fetchProductByHandle(slug)

	if (!product || isCharmCopyProduct(product)) {
		return { title: 'Difinery | Product not found' }
	}

	const shareImage = getShareImageFromProduct(product)

	return {
		title: 'Difinery | ' + product.title,
		description: product.description ? product.description : '',
		...getSocialImageMetadata(shareImage, { path: productPath(product) })
	}
}

export default async function Product(props) {
	const params = await props.params
	const { category, slug } = params

	// FAQs with caching
	const faqs = await getCachedProductFAQs()

	const product = await fetchProductByHandle(slug)
	if (!product || isCharmCopyProduct(product)) {
		notFound()
	}

	// The route answers under any category segment; send everything else to
	// the one canonical URL so search engines see a single page per product.
	const canonicalPath = productPath(product)
	if (canonicalPath !== `/shop/${category}/product/${slug}`) {
		permanentRedirect(canonicalPath)
	}
	const canonicalCategory = productCategorySlug(product)

	// Fetch recommended products if they exist
	let recommendedProducts = []
	if (product.metafield?.value) {
		const recommendedProductIds = product.metafield.value
		const { data: allProductsData } = await apolloClient.query({
			query: GET_PRODUCTS,
			variables: { first: 250, after: null },
			context: {
				fetchOptions: {
					next: { revalidate: false }
				}
			}
		})
		const allProducts = (allProductsData?.products?.edges || []).map(
			edge => edge.node
		)
		recommendedProducts = allProducts.filter(
			item =>
				recommendedProductIds.includes(item.id) && !isCharmCopyProduct(item)
		)
	}

	return (
		<>
			<JsonLd data={productJsonLd(product)} />
			<JsonLd
				data={breadcrumbJsonLd([
					{ name: 'Home', path: '/' },
					...(canonicalCategory
						? [
								{
									name:
										canonicalCategory.charAt(0).toUpperCase() +
										canonicalCategory.slice(1),
									path: `/shop/${canonicalCategory}/yellow-gold/all`
								}
							]
						: []),
					{ name: product.title, path: canonicalPath }
				])}
			/>
			<ProductPageLayout
				product={product}
				recommendedProducts={recommendedProducts}
				faqs={faqs}
			/>
		</>
	)
}
