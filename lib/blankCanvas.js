// Shared helpers for Blank Canvas articles (Contentful `blankCanvasArticle`).

// URL slug for an article, from its artist name: "Loria Stern" -> "loria-stern"
export const blankCanvasSlug = artistName =>
	artistName
		.toLowerCase()
		.replace(/[^a-z0-9 ]/gi, '')
		.replace(/&/g, '')
		.trim()
		.replace(/ +/g, '-')

const WORDS_PER_MINUTE = 200

const richTextWordCount = node => {
	if (!node) return 0
	if (node.nodeType === 'text') {
		return node.value.split(/\s+/).filter(Boolean).length
	}
	return (node.content || []).reduce(
		(sum, child) => sum + richTextWordCount(child),
		0
	)
}

// Estimated read time in whole minutes for a rich text document
export const readTimeMinutes = richText =>
	Math.max(1, Math.round(richTextWordCount(richText) / WORDS_PER_MINUTE))
