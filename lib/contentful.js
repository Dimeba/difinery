import { createClient } from 'contentful'

const client = createClient({
	space: process.env.space,
	accessToken: process.env.accessToken
})

// Simple in-memory TTL cache to reduce Contentful API calls
const TTL_MS = Number(process.env.CONTENTFUL_CACHE_TTL_MS || 5 * 60 * 1000) // 5 minutes default
const cacheStore = new Map()

function getCache(key) {
	const entry = cacheStore.get(key)
	if (!entry) return undefined
	if (Date.now() > entry.exp) {
		cacheStore.delete(key)
		return undefined
	}
	return entry.value
}

function setCache(key, value) {
	cacheStore.set(key, { value, exp: Date.now() + TTL_MS })
}

export async function getEntries(contentType) {
	const key = `entries:${contentType}`
	const cached = getCache(key)
	if (cached) return cached

	const content = await client.getEntries({ content_type: contentType })
	setCache(key, content)
	return content
}

export async function getEntry(id) {
	const key = `entry:${id}`
	const cached = getCache(key)
	if (cached) return cached

	const item = await client.getEntry(id)
	setCache(key, item)
	return item
}

// Batch fetch multiple entries by IDs using Contentful 'in' filter
export async function getEntriesByIds(ids = []) {
	if (!Array.isArray(ids) || ids.length === 0) return { items: [] }
	// Build cache hits and missing IDs
	const results = []
	const missing = []
	const indexMap = new Map()
	ids.forEach((id, i) => {
		indexMap.set(id, i)
		const cached = getCache(`entry:${id}`)
		if (cached) {
			results[i] = cached
		} else {
			missing.push(id)
		}
	})

	if (missing.length > 0) {
		const response = await client.getEntries({
			'sys.id[in]': missing.join(',')
		})
		// cache fetched and place in correct order
		response.items.forEach(item => {
			setCache(`entry:${item.sys.id}`, item)
			const idx = indexMap.get(item.sys.id)
			if (idx !== undefined) results[idx] = item
		})
	}

	return { items: results.filter(Boolean) }
}
