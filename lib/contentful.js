import { createClient } from 'contentful'

const client = createClient({
	space: process.env.space,
	accessToken: process.env.accessToken
})

export async function getEntries(contentType) {
	const content = await client.getEntries({ content_type: contentType })
	return content
}

export async function getEntry(id) {
	const item = await client.getEntry(id)
	return item
}

// Batch fetch multiple entries by IDs using Contentful 'in' filter
export async function getEntriesByIds(ids = []) {
	if (!Array.isArray(ids) || ids.length === 0) return { items: [] }
	// Fetch all requested IDs in one call and reorder to match input IDs
	const response = await client.getEntries({ 'sys.id[in]': ids.join(',') })
	const byId = new Map(response.items.map(item => [item.sys.id, item]))
	const ordered = ids.map(id => byId.get(id)).filter(Boolean)
	return { items: ordered }
}
