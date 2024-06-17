// shopify
import Client from 'shopify-buy'

const client = Client.buildClient({
	domain: process.env.domain,
	storefrontAccessToken: process.env.token
})

export const getProducts = async () => {
	try {
		const products = await client.product.fetchAll()
		return products
	} catch (error) {
		console.error('Error fetching products:', error)
		throw error
	}
}

export const getProduct = async id => {
	try {
		const product = await client.product.fetch(id)
		return product
	} catch (error) {
		console.error('Error fetching product:', error)
		throw error
	}
}

export const getCollections = async () => {
	try {
		const collections = await client.collection.fetchAllWithProducts()
		return collections
	} catch (error) {
		console.error('Error fetching collections:', error)
		throw error
	}
}
