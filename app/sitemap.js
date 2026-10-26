import { getEntries } from '@/lib/contentful'
import { apolloClient } from '@/lib/apolloClient'
import { GET_PRODUCTS } from '@/lib/queries/getProducts'
import { isCharmCopyProduct } from '@/lib/charmNecklace'
import { productCategorySlug, productPath, SHOP_CATEGORIES } from '@/lib/productUrl'
import { collectionSlug } from '@/lib/collectionSlug'
import { BRIDAL_PAGES } from '@/lib/bridal'

// Every URL listed here must answer 200 directly. /shop, /shop/all and
// /shop/<category> only redirect (see proxy.js), so the listings below use
// their final /<metal>/all form.

// Collections that redirect to the bridal section (next.config.mjs).
const REDIRECTED_COLLECTIONS = ['bridal', 'engagement-rings']

// CMS pages that exist only to feed other routes.
const NON_PAGE_TITLES = ['Homepage', 'Shop']

export default async function sitemap() {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://difinery.com'
	const metals = ['yellow-gold', 'white-gold', 'rose-gold']

	// Static pages
	const staticPages = [
		{
			url: baseUrl,
			changeFrequency: 'daily',
			priority: 1
		},
		{
			url: `${baseUrl}/shop/gift-card`,
			changeFrequency: 'monthly',
			priority: 0.7
		}
	]

	const listingPages = ['all', ...SHOP_CATEGORIES].flatMap(category =>
		metals.map(metal => ({
			url: `${baseUrl}/shop/${category}/${metal}/all`,
			changeFrequency: 'daily',
			priority: metal === 'yellow-gold' ? 0.8 : 0.75
		}))
	)

	const bridalPages = BRIDAL_PAGES.map(page => ({
		url: `${baseUrl}/bridal/${page.slug}`,
		changeFrequency: 'weekly',
		priority: 0.8
	}))

	try {
		// Fetch products from Shopify
		const { data } = await apolloClient.query({
			query: GET_PRODUCTS,
			variables: { first: 250, after: null }
		})

		const products = data.products.edges.map(edge => edge.node)

		// Only standalone jewelry: gift cards, engraving and packaging have no
		// product page of their own.
		const productPages = products
			.filter(
				product =>
					product.handle &&
					!isCharmCopyProduct(product) &&
					productCategorySlug(product)
			)
			.map(product => ({
				url: `${baseUrl}${productPath(product)}`,
				...(product.updatedAt && {
					lastModified: new Date(product.updatedAt)
				}),
				changeFrequency: 'weekly',
				priority: 0.7
			}))

		const [collectionsResponse, pagesResponse, articlesResponse] =
			await Promise.all([
				getEntries('collection'),
				getEntries('page'),
				getEntries('blankCanvasArticle').catch(() => ({ items: [] }))
			])

		// Slugs follow the same rule the routes use to resolve them.
		const collectionPages = (collectionsResponse.items || [])
			.filter(collection => collection.fields?.title)
			.filter(collection => collection.fields.dontRender !== true)
			.map(collection => ({
				slug: collectionSlug(collection.fields.title),
				updatedAt: collection.sys.updatedAt
			}))
			.filter(({ slug }) => !REDIRECTED_COLLECTIONS.includes(slug))
			.map(({ slug, updatedAt }) => ({
				url: `${baseUrl}/shop/collections/${slug}`,
				lastModified: new Date(updatedAt),
				changeFrequency: 'weekly',
				priority: 0.6
			}))

		const dynamicPages = (pagesResponse.items || [])
			.filter(page => page.fields?.title)
			.filter(page => page.fields.dontRender !== true)
			.filter(page => !NON_PAGE_TITLES.includes(page.fields.title))
			.map(page => ({
				url: `${baseUrl}/${collectionSlug(page.fields.title)}`,
				lastModified: new Date(page.sys.updatedAt),
				changeFrequency: 'monthly',
				priority: 0.5
			}))

		const articlePages = (articlesResponse.items || [])
			.filter(article => article.fields?.artistName)
			.map(article => ({
				url: `${baseUrl}/blank-canvas/${collectionSlug(article.fields.artistName)}`,
				lastModified: new Date(article.sys.updatedAt),
				changeFrequency: 'monthly',
				priority: 0.5
			}))

		// Combine all URLs
		return [
			...staticPages,
			...listingPages,
			...bridalPages,
			...productPages,
			...collectionPages,
			...dynamicPages,
			...articlePages
		]
	} catch (error) {
		console.error('Error generating sitemap:', error)
		// Return at least static pages if dynamic fetching fails
		return [...staticPages, ...listingPages, ...bridalPages]
	}
}
