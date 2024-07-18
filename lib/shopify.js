// shopify
import Client from 'shopify-buy'

export const client = Client.buildClient({
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

export const createCheckout = async () => {
	try {
		const checkout = await client.checkout.create()
		return checkout
	} catch (error) {
		console.error('Error creating checkout:', error)
		throw error
	}
}

export const updateCheckoutAttributes = async (checkoutId, attributes) => {
	try {
		const checkout = await client.checkout.updateAttributes(
			checkoutId,
			attributes
		)
		return checkout
	} catch (error) {
		console.error('Error updating checkout attributes:', error)
		throw error
	}
}

export const getCheckout = async id => {
	try {
		const checkout = await client.checkout.fetch(id)
		return checkout
	} catch (error) {
		console.error('Error fetching checkout:', error)
		throw error
	}
}

export const addLineItems = async (checkoutId, lineItems) => {
	try {
		const checkout = await client.checkout.addLineItems(checkoutId, lineItems)
		return checkout
	} catch (error) {
		console.error('Error adding line items:', error)
		throw error
	}
}

// Extract Shopify ID from base64 from Contentful
export const extractShopifyId = base64 => {
	const buffer = Buffer.from(base64.toString(), 'base64')
	const shopifyId = buffer.toString('utf-8')

	return shopifyId
}
