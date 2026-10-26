// schema.org JSON-LD for search engines and AI agents. Rendered by the
// <JsonLd> component as a <script type="application/ld+json">.

import { productPath } from '@/lib/productUrl'

export const SITE_URL = (
	process.env.NEXT_PUBLIC_SITE_URL || 'https://difinery.com'
).replace(/\/$/, '')

const absolute = path => `${SITE_URL}${path}`

export function organizationJsonLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'Difinery',
		url: SITE_URL,
		logo: absolute('/logo-black.svg'),
		description:
			'Fine jewelry handcrafted in NYC with lab-grown diamonds and 100% recycled 14k gold.'
	}
}

export function websiteJsonLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'Difinery',
		url: SITE_URL
	}
}

export function productJsonLd(product) {
	const url = absolute(productPath(product))
	const images = (product.images?.edges || [])
		.map(edge => edge?.node?.url)
		.filter(Boolean)
		.slice(0, 10)
	const min = product.priceRange?.minVariantPrice
	const max = product.priceRange?.maxVariantPrice
	const currency = min?.currencyCode || 'USD'
	const availability = product.availableForSale
		? 'https://schema.org/InStock'
		: 'https://schema.org/OutOfStock'

	const offers =
		min && max && min.amount !== max.amount
			? {
					'@type': 'AggregateOffer',
					priceCurrency: currency,
					lowPrice: min.amount,
					highPrice: max.amount,
					offerCount: product.variants?.edges?.length || 1,
					availability,
					url
				}
			: {
					'@type': 'Offer',
					priceCurrency: currency,
					price: min?.amount,
					availability,
					url
				}

	return {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: product.title,
		description: product.description || undefined,
		image: images,
		sku: product.variants?.edges?.[0]?.node?.sku || undefined,
		category: product.category?.name || undefined,
		brand: { '@type': 'Brand', name: 'Difinery' },
		url,
		offers
	}
}

export function breadcrumbJsonLd(items) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: absolute(item.path)
		}))
	}
}
