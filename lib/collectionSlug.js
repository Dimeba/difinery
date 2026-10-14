export function collectionLabel(title = '') {
	return title
}

export function collectionSlug(title = '') {
	return collectionLabel(title)
		.toString()
		.toLowerCase()
		.replace(/[^a-z0-9 ]/gi, '')
		.replace(/&/g, '')
		.trim()
		.replace(/ +/g, '-')
}
