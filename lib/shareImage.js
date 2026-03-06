export const getPreferredShareImageUrl = urls => {
	const normalized = (urls || [])
		.map(url => (typeof url === 'string' ? url.trim() : ''))
		.filter(Boolean)

	if (normalized.length === 0) return null

	const jpg = normalized.find(url => url.toLowerCase().includes('.jpg'))
	if (jpg) return jpg

	const png = normalized.find(url => url.toLowerCase().includes('.png'))
	if (png) return png

	return normalized[0]
}

export const getShareImageFromProduct = product => {
	const imageUrls =
		product?.images?.edges
			?.map(edge => edge?.node?.url)
			.filter(Boolean) || []

	return getPreferredShareImageUrl(imageUrls)
}

export const getShareImageFromProducts = products => {
	const firstProduct = products?.[0]
	return getShareImageFromProduct(firstProduct)
}

export const getSocialImageMetadata = imageUrl => {
	if (!imageUrl) return {}

	return {
		openGraph: {
			images: [{ url: imageUrl }]
		},
		twitter: {
			card: 'summary_large_image',
			images: [imageUrl]
		}
	}
}
