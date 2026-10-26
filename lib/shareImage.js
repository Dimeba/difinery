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

// A page's openGraph replaces the layout's wholesale, so the shared fields are
// set here rather than in the root metadata. `path` doubles as the canonical
// URL (resolved against metadataBase).
export const getSocialImageMetadata = (imageUrl, { path } = {}) => {
	const metadata = {}

	if (path) {
		metadata.alternates = { canonical: path }
	}

	if (path || imageUrl) {
		metadata.openGraph = {
			siteName: 'Difinery',
			type: 'website',
			locale: 'en_US',
			...(path && { url: path }),
			...(imageUrl && { images: [{ url: imageUrl }] })
		}
	}

	if (imageUrl) {
		metadata.twitter = {
			card: 'summary_large_image',
			images: [imageUrl]
		}
	}

	return metadata
}
