export const getPreferredShareImageUrl = urls => {
	const normalized = (urls || [])
		.map(url => (typeof url === 'string' ? url.trim() : ''))
		.filter(Boolean)

	if (normalized.length === 0) return null

	const cover = normalized.find(url => url.toLowerCase().includes('-cover'))
	if (cover) return cover

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
	const list = products || []

	// Match listing card behavior: use the first available "-cover" image.
	for (const product of list) {
		const imageUrls =
			product?.images?.edges
				?.map(edge => edge?.node?.url)
				.filter(Boolean) || []
		const cover = imageUrls.find(url => url.toLowerCase().includes('-cover'))
		if (cover) return cover
	}

	const firstProduct = list[0]
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
