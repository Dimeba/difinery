import { getEntries } from '@/lib/contentful'
import { apolloClient } from '@/lib/apolloClient'
import { GET_PRODUCTS } from '@/lib/queries/getProducts'

export default async function sitemap() {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://difinery.com'

	// Static pages
	const staticPages = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1
		},
		{
			url: `${baseUrl}/shop`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.9
		},
		{
			url: `${baseUrl}/shop/all`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.8
		}
	]

	// Category pages
	const categories = ['bracelets', 'earrings', 'rings', 'necklaces']
	const metals = ['yellow-gold', 'white-gold', 'rose-gold']

	const categoryPages = categories.flatMap(category => [
		{
			url: `${baseUrl}/shop/${category}`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.8
		},
		...metals.map(metal => ({
			url: `${baseUrl}/shop/${category}/${metal}/all`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.75
		}))
	])

	// Shop all pages with metals
	const shopAllPages = metals.map(metal => ({
		url: `${baseUrl}/shop/all/${metal}/all`,
		lastModified: new Date(),
		changeFrequency: 'daily',
		priority: 0.75
	}))

	try {
		// Fetch products from Shopify
		const { data } = await apolloClient.query({
			query: GET_PRODUCTS,
			variables: { first: 250, after: null }
		})

		const products = data.products.edges.map(edge => edge.node)

		const productPages = products
			.filter(product => product.handle)
			.map(product => {
				const categoryName = product.category?.name?.toLowerCase() || 'all'
				const matchedCategory = categories.find(cat =>
					categoryName.includes(cat.slice(0, -1))
				)
				const category = matchedCategory || 'all'

				return {
					url: `${baseUrl}/shop/${category}/product/${product.handle}`,
					lastModified: new Date(),
					changeFrequency: 'weekly',
					priority: 0.7
				}
			})

		// Fetch collections from Contentful
		const collectionsResponse = await getEntries('collection')
		const collections = collectionsResponse.items || []

		const collectionPages = collections
			.filter(collection => collection.fields?.slug)
			.map(collection => ({
				url: `${baseUrl}/shop/collections/${collection.fields.slug}`,
				lastModified: new Date(collection.sys.updatedAt),
				changeFrequency: 'weekly',
				priority: 0.6
			}))

		// Fetch dynamic pages from Contentful
		const pagesResponse = await getEntries('page')
		const pages = pagesResponse.items || []

		const dynamicPages = pages
			.filter(page => page.fields?.slug)
			.map(page => ({
				url: `${baseUrl}/${page.fields.slug}`,
				lastModified: new Date(page.sys.updatedAt),
				changeFrequency: 'monthly',
				priority: 0.5
			}))

		// Combine all URLs
		return [
			...staticPages,
			...categoryPages,
			...shopAllPages,
			...productPages,
			...collectionPages,
			...dynamicPages
		]
	} catch (error) {
		console.error('Error generating sitemap:', error)
		// Return at least static pages if dynamic fetching fails
		return staticPages
	}
}
