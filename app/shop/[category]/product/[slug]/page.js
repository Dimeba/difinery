import ProductPageLayout from '@/components/ProductPageLayout'

// lib
import { getCachedProductFAQs } from '@/lib/cachedContentful'
import { apolloClient } from '@/lib/apolloClient'
import { Suspense } from 'react'
import { GET_PRODUCTS } from '@/lib/queries/getProducts'
import { GET_PRODUCT_BY_HANDLE } from '@/lib/queries/getProductByHandle'
import { notFound } from 'next/navigation'
import {
	getShareImageFromProduct,
	getSocialImageMetadata
} from '@/lib/shareImage'

export const revalidate = 3600 // Revalidate every hour

// Generate static params for all products
export async function generateStaticParams() {
	const { data } = await apolloClient.query({
		query: GET_PRODUCTS,
		variables: { first: 250, after: null }
	})

	const products = data.products.edges.map(edge => edge.node)
	const categories = ['bracelets', 'earrings', 'rings', 'necklaces']

	// Generate params for each product in each category
	return products.flatMap(product => {
		const categoryName = product.category?.name?.toLowerCase() || 'all'
		const matchedCategory = categories.find(cat =>
			categoryName.includes(cat.slice(0, -1))
		)

		if (matchedCategory) {
			return [{ category: matchedCategory, slug: product.handle }]
		}
		return []
	})
}

export async function generateMetadata(props) {
	const params = await props.params
	const { slug } = params

	const { data } = await apolloClient.query({
		query: GET_PRODUCT_BY_HANDLE,
		variables: { handle: slug },
		context: {
			fetchOptions: {
				next: { revalidate: 3600 } // Cache for 1 hour
			}
		}
	})
	const product = data.productByHandle

	if (!product) {
		return { title: 'Difinery | Product not found' }
	}

	const shareImage = getShareImageFromProduct(product)

	return {
		title: 'Difinery | ' + product.title,
		description: product.description ? product.description : '',
		...getSocialImageMetadata(shareImage)
	}
}

export default async function Product(props) {
	const params = await props.params
	const { slug } = params

	// FAQs with caching
	const faqs = await getCachedProductFAQs()

	const { data } = await apolloClient.query({
		query: GET_PRODUCT_BY_HANDLE,
		variables: { handle: slug },
		context: {
			fetchOptions: {
				next: { revalidate: 3600 } // Cache for 1 hour
			}
		}
	})
	const product = data.productByHandle
	if (!product) {
		notFound()
	}

	// Fetch recommended products if they exist
	let recommendedProducts = []
	if (product.metafield?.value) {
		const recommendedProductIds = product.metafield.value
		const { data: allProductsData } = await apolloClient.query({
			query: GET_PRODUCTS,
			variables: { first: 250, after: null },
			context: {
				fetchOptions: {
					next: { revalidate: 3600 }
				}
			}
		})
		const allProducts = allProductsData.products.edges.map(edge => edge.node)
		recommendedProducts = allProducts.filter(item =>
			recommendedProductIds.includes(item.id)
		)
	}

	return (
		<ProductPageLayout
			product={product}
			recommendedProducts={recommendedProducts}
			faqs={faqs}
		/>
	)
}
