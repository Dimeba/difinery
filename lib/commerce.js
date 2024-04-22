import Commerce from '@chec/commerce.js'

const client = new Commerce(process.env.NEXT_PUBLIC_CHEC_PUBLIC_API_KEY)

export async function getCategories() {
	try {
		const { data: categories } = await client.categories.list()
		return categories
	} catch (error) {
		console.error('Failed to fetch products:', error)
		return []
	}
}

export async function getProducts() {
	try {
		const { data: products } = await client.products.list()
		return products
	} catch (error) {
		console.error('Failed to fetch products:', error)
		return []
	}
}

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

export async function getProduct(permalink) {
	try {
		const product = await client.products.retrieve(permalink, {
			type: 'permalink'
		})
		return product
	} catch (error) {
		console.error('Failed to retrieve product:', error)
		return null
	}
}
