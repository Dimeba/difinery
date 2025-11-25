import { getEntries } from './contentful'
import { unstable_cache } from 'next/cache'

/**
 * Cached Contentful data fetching to reduce server response time
 */

// Cache shop page content for 1 hour
export const getCachedShopPageContent = unstable_cache(
	async () => {
		const pages = await getEntries('page')
		return pages.items.find(page => page.fields.title == 'Shop')?.fields || {}
	},
	['shop-page-content'],
	{
		revalidate: 3600,
		tags: ['contentful', 'shop-page']
	}
)

// Cache product page FAQs for 1 hour
export const getCachedProductFAQs = unstable_cache(
	async () => {
		const allFaqs = await getEntries('accordion')
		return (
			allFaqs.items.find(item => item.fields.productPage === 'Yes') || {
				fields: { rows: [] }
			}
		)
	},
	['product-page-faqs'],
	{
		revalidate: 3600,
		tags: ['contentful', 'faqs']
	}
)

// Cache collections for 1 hour
export const getCachedCollections = unstable_cache(
	async () => {
		return await getEntries('collection')
	},
	['collections'],
	{
		revalidate: 3600,
		tags: ['contentful', 'collections']
	}
)
