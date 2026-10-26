// One place that decides which /shop/<category>/product/<handle> URL a
// product lives at. The product route accepts any category segment, so every
// link, the sitemap and the canonical redirect must agree on this.

export const SHOP_CATEGORIES = ['bracelets', 'earrings', 'rings', 'necklaces']

// Shopify category name (lowercased) → shop category. Checked in order, so
// "earring" is matched before "ring", "wedding band" lands in rings and
// "pendant" in necklaces.
const CATEGORY_MATCHERS = [
	['earring', 'earrings'],
	['wedding band', 'rings'],
	['ring', 'rings'],
	['pendant', 'necklaces'],
	['necklace', 'necklaces'],
	['jewelry', 'necklaces'],
	['bracelet', 'bracelets']
]

/**
 * Shop category segment for a product, or null for things that are not sold
 * as standalone jewelry (gift cards, engraving, packaging).
 */
export function productCategorySlug(product) {
	const name = (product?.category?.name || '').toLowerCase()
	const match = CATEGORY_MATCHERS.find(([needle]) => name.includes(needle))
	return match ? match[1] : null
}

const isGiftCard = product =>
	(product?.category?.name || '').toLowerCase().includes('gift card')

/**
 * Canonical path of a product page. The gift card has its own page; other
 * uncategorised products fall back to the rings folder so a link never points
 * at a 404.
 */
export function productPath(product) {
	if (isGiftCard(product)) return '/shop/gift-card'
	const category = productCategorySlug(product) || 'rings'
	return `/shop/${category}/product/${product.handle}`
}
