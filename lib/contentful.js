import { createClient } from 'contentful'

const client = createClient({
	space: process.env.space,
	accessToken: process.env.accessToken
})

export async function getEntries(contentType) {
	const content = await client.getEntries({
		content_type: contentType
	})

	return content
}

export async function getEntry(id) {
	const item = await client.getEntry(id)

	return item
}
