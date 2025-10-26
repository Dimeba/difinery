/**
 * Google Analytics 4 E-commerce Events Helper
 *
 * This helper provides functions to track e-commerce events in GA4 via Google Tag Manager.
 * All events follow GA4's recommended e-commerce event structure.
 *
 * Reference: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

/**
 * Format a Shopify product for GA4 tracking
 * @param {Object} product - Shopify product object
 * @param {Object} variant - Shopify variant object (optional)
 * @param {number} quantity - Product quantity (default: 1)
 * @param {number} index - Position in list (optional, for list views)
 * @param {string} listName - Name of the list (optional, for list views)
 * @returns {Object} GA4-formatted item object
 */
export const formatProductForGA = (
	product,
	variant = null,
	quantity = 1,
	index = null,
	listName = null
) => {
	// Use variant or first product variant for pricing
	const actualVariant =
		variant || product.variants?.edges?.[0]?.node || product.merchandise

	// Get price from variant
	const price = actualVariant?.price?.amount || actualVariant?.priceV2?.amount

	// Get product title
	const productTitle = product.title || actualVariant?.product?.title || ''

	// Get variant title/options
	const variantTitle = actualVariant?.title || ''

	// Get SKU
	const sku = actualVariant?.sku || actualVariant?.id || ''

	// Get category
	const category = product.category?.name || product.productType || ''

	// Build the GA4 item object
	const item = {
		item_id: sku,
		item_name: productTitle,
		currency: 'USD',
		price: price ? parseFloat(price) : 0,
		quantity: quantity
	}

	// Add optional fields if available
	if (variantTitle && variantTitle !== 'Default Title') {
		item.item_variant = variantTitle
	}

	if (category) {
		item.item_category = category
	}

	if (index !== null) {
		item.index = index
	}

	if (listName) {
		item.item_list_name = listName
	}

	return item
}

/**
 * Format cart items for GA4 tracking
 * @param {Object} cart - Shopify cart object
 * @returns {Array} Array of GA4-formatted items
 */
export const formatCartItemsForGA = cart => {
	if (!cart?.lines?.edges) return []

	return cart.lines.edges.map(({ node }, index) => {
		const variant = node.merchandise
		const product = variant?.product || {}
		const quantity = node.quantity || 1

		return formatProductForGA(
			{ ...product, title: product.title },
			variant,
			quantity
		)
	})
}

/**
 * Calculate cart total value
 * @param {Object} cart - Shopify cart object
 * @returns {number} Total cart value
 */
export const getCartValue = cart => {
	const totalAmount = cart?.cost?.totalAmount?.amount
	return totalAmount ? parseFloat(totalAmount) : 0
}

/**
 * Push event to dataLayer (GTM)
 * @param {Object} eventData - Event data object
 */
const pushToDataLayer = eventData => {
	if (typeof window !== 'undefined' && window.dataLayer) {
		window.dataLayer.push({ ecommerce: null }) // Clear previous ecommerce data
		window.dataLayer.push(eventData)
	}
}

/**
 * Track view_item_list event (product list view)
 * @param {Array} products - Array of Shopify product objects
 * @param {string} listName - Name of the list (e.g., "Search Results", "Category: Rings")
 */
export const trackViewItemList = (products, listName) => {
	const items = products.map((product, index) =>
		formatProductForGA(product, null, 1, index, listName)
	)

	pushToDataLayer({
		event: 'view_item_list',
		ecommerce: {
			item_list_name: listName,
			items: items
		}
	})
}

/**
 * Track select_item event (product click from list)
 * @param {Object} product - Shopify product object
 * @param {string} listName - Name of the list where item was clicked
 * @param {number} index - Position in the list
 */
export const trackSelectItem = (product, listName, index = 0) => {
	const items = [formatProductForGA(product, null, 1, index, listName)]

	pushToDataLayer({
		event: 'select_item',
		ecommerce: {
			item_list_name: listName,
			items: items
		}
	})
}

/**
 * Track view_item event (product detail view)
 * @param {Object} product - Shopify product object
 * @param {Object} variant - Selected variant (optional)
 */
export const trackViewItem = (product, variant = null) => {
	const items = [formatProductForGA(product, variant, 1)]

	// Calculate value
	const value = items[0].price

	pushToDataLayer({
		event: 'view_item',
		ecommerce: {
			currency: 'USD',
			value: value,
			items: items
		}
	})
}

/**
 * Track add_to_cart event
 * @param {Object} product - Shopify product object
 * @param {Object} variant - Selected variant
 * @param {number} quantity - Quantity added
 */
export const trackAddToCart = (product, variant, quantity = 1) => {
	const items = [formatProductForGA(product, variant, quantity)]

	// Calculate value
	const value = items[0].price * quantity

	pushToDataLayer({
		event: 'add_to_cart',
		ecommerce: {
			currency: 'USD',
			value: value,
			items: items
		}
	})
}

/**
 * Track remove_from_cart event
 * @param {Object} cartLineNode - Shopify cart line node
 * @param {number} quantityRemoved - Quantity removed (if partial removal)
 */
export const trackRemoveFromCart = (cartLineNode, quantityRemoved = null) => {
	const variant = cartLineNode.merchandise
	const product = variant?.product || {}
	const quantity = quantityRemoved || cartLineNode.quantity || 1

	const items = [
		formatProductForGA({ ...product, title: product.title }, variant, quantity)
	]

	// Calculate value
	const value = items[0].price * quantity

	pushToDataLayer({
		event: 'remove_from_cart',
		ecommerce: {
			currency: 'USD',
			value: value,
			items: items
		}
	})
}

/**
 * Track view_cart event (cart opened/viewed)
 * @param {Object} cart - Shopify cart object
 */
export const trackViewCart = cart => {
	const items = formatCartItemsForGA(cart)
	const value = getCartValue(cart)

	pushToDataLayer({
		event: 'view_cart',
		ecommerce: {
			currency: 'USD',
			value: value,
			items: items
		}
	})
}

/**
 * Track begin_checkout event (user clicks checkout button)
 * @param {Object} cart - Shopify cart object
 */
export const trackBeginCheckout = cart => {
	const items = formatCartItemsForGA(cart)
	const value = getCartValue(cart)

	pushToDataLayer({
		event: 'begin_checkout',
		ecommerce: {
			currency: 'USD',
			value: value,
			items: items
		}
	})
}

/**
 * Track search event (product search)
 * @param {string} searchTerm - The search query
 */
export const trackSearch = searchTerm => {
	pushToDataLayer({
		event: 'search',
		search_term: searchTerm
	})
}

/**
 * Track custom promotion view (e.g., banners, featured collections)
 * @param {string} promotionId - Unique promotion ID
 * @param {string} promotionName - Promotion name
 * @param {string} creativeName - Creative/banner name (optional)
 * @param {string} creativeSlot - Position/slot (optional)
 */
export const trackViewPromotion = (
	promotionId,
	promotionName,
	creativeName = null,
	creativeSlot = null
) => {
	const promotion = {
		promotion_id: promotionId,
		promotion_name: promotionName
	}

	if (creativeName) promotion.creative_name = creativeName
	if (creativeSlot) promotion.creative_slot = creativeSlot

	pushToDataLayer({
		event: 'view_promotion',
		ecommerce: {
			items: [promotion]
		}
	})
}

/**
 * Track custom filter interaction (for your shop filters)
 * @param {string} filterType - Type of filter (e.g., "metal", "shape", "category")
 * @param {string} filterValue - Selected filter value
 */
export const trackFilterInteraction = (filterType, filterValue) => {
	pushToDataLayer({
		event: 'filter_interaction',
		filter_type: filterType,
		filter_value: filterValue
	})
}

/**
 * Track newsletter signup
 * @param {string} email - User email (optional, be careful with PII)
 * @param {string} location - Where signup happened (e.g., "footer", "popup")
 */
export const trackNewsletterSignup = (location = 'footer') => {
	pushToDataLayer({
		event: 'newsletter_signup',
		location: location
	})
}
