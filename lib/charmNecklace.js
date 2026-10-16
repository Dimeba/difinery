import { findMetalOption } from '@/lib/helpers'

export const CHAIN_HANDLE = 'necklace-chain-copy'
export const MAX_CHARMS = 5

const filenameOf = url =>
	decodeURIComponent((url || '').split('/').pop().split('?')[0]).toLowerCase()

export const isBezelPendantProduct = product => {
	const category = (product?.category?.name || '').toLowerCase()
	const tags = Array.isArray(product?.tags) ? product.tags : []
	const title = (product?.title || '').toLowerCase()
	return (
		(category.includes('pendant') || category.includes('necklace')) &&
		tags.includes('CustomShape') &&
		title.includes('bezel pendant')
	)
}

export const bezelPendantHandles = product => {
	const handles = new Set()
	if (product?.handle) handles.add(product.handle)

	for (const edge of product?.collections?.edges || []) {
		for (const productEdge of edge?.node?.products?.edges || []) {
			const node = productEdge?.node
			const tags = Array.isArray(node?.tags) ? node.tags : []
			const title = (node?.title || '').toLowerCase()
			if (tags.includes('CustomShape') && title.includes('bezel pendant')) {
				handles.add(node.handle)
			}
		}
	}

	return [...handles]
}

export const shapeOfProduct = (product, shapes) => {
	const title = (product?.title || '').toLowerCase()
	return shapes.find(shape => title.includes(shape.title.toLowerCase())) || null
}

export const productForShape = (catalog, shapeTitle) => {
	const needle = (shapeTitle || '').toLowerCase()
	return (
		catalog.find(product =>
			(product.handle || '').toLowerCase().includes(needle)
		) || null
	)
}

export const caratOption = product =>
	(product?.options || []).find(option =>
		(option?.name || '').toLowerCase().includes('carat')
	)

export const lockedCaratValue = product => {
	const values = caratOption(product)?.optionValues || []
	const match = values.find(value => Number(value.name) === 0.2)
	return match?.name || null
}

export const findVariant = (product, selected) => {
	const entries = Object.entries(selected).filter(([, value]) => value)
	return (
		product?.variants?.edges?.find(({ node }) =>
			entries.every(([name, value]) =>
				node.selectedOptions.some(
					option => option.name === name && option.value === value
				)
			)
		)?.node || null
	)
}

export const optionValueOrFirst = (product, optionName, preferred) => {
	const option = (product?.options || []).find(item => item.name === optionName)
	const values = option?.optionValues || []
	if (values.some(value => value.name === preferred)) return preferred
	return values[0]?.name || null
}

export const chainImageUrl = (chain, goldName) => {
	const token = (goldName || '').toLowerCase().includes('yellow')
		? 'chainyellowg'
		: 'chainwhiteg'
	const images = (chain?.images?.edges || []).map(edge => edge.node)
	const matches = images.filter(image => filenameOf(image.url).includes(token))
	const full = matches.find(image => !filenameOf(image.url).includes('crop'))
	return (full || matches[0])?.url || null
}

export const pendantAssetUrl = (product, goldName) => {
	const gold = (goldName || '').toLowerCase()
	const prefix = gold.includes('rose') ? 'r' : gold.includes('white') ? 'w' : 'y'
	const images = (product?.images?.edges || []).map(edge => edge.node)
	const assets = images.filter(image => {
		const file = filenameOf(image.url)
		return file.includes('asset') && !file.includes('chain')
	})
	const match = assets.find(image => filenameOf(image.url).startsWith(prefix))
	return match?.url || null
}

export const displayDollars = amount => {
	const value = Number(String(amount ?? '').slice(0, -2))
	return Number.isFinite(value) ? value : 0
}

export const metalOptionName = product => findMetalOption(product?.options)?.name || null
