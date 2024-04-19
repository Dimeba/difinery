import Commerce from '@chec/commerce.js'

const client = new Commerce(process.env.NEXT_PUBLIC_CHEC_PUBLIC_API_KEY)

export const { data: categories } = await client.categories.list()
export const { data: products } = await client.products.list()

export async function getProductsInCategory(categorySlug) {
	try {
		const params = {
			category_slug: categorySlug
		}
		const { data: products } = await client.products.list(params)
		return products
	} catch (error) {
		console.error('Error fetching products for category:', categorySlug, error)
		return []
	}
}
