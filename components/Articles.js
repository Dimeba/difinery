// components
import { Box, Typography } from '@mui/material'

// lib
import { getEntries } from '@/lib/contentful'

const hashStringToUint32 = value => {
	const str = String(value ?? '')
	let hash = 2166136261
	for (let i = 0; i < str.length; i++) {
		hash ^= str.charCodeAt(i)
		hash = Math.imul(hash, 16777619)
	}
	return hash >>> 0
}

const mulberry32 = seed => {
	let a = seed >>> 0
	return () => {
		let t = (a += 0x6d2b79f5)
		t = Math.imul(t ^ (t >>> 15), t | 1)
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296
	}
}

const computeBentoSpans = (items, columns = 4) => {
	const spans = []
	let remaining = columns

	for (let index = 0; index < items.length; index++) {
		const article = items[index]
		const seed =
			hashStringToUint32(article?.sys?.id ?? index) ^
			Math.imul(index + 1, 0x9e3779b9)
		const rand = mulberry32(seed)()

		// Pseudo-random (but stable) bento widths for a 4-col grid
		// Mostly 1-col, sometimes 2-col, rarely 3-col.
		const desiredSpan = rand < 0.12 ? 3 : rand < 0.42 ? 2 : 1
		let span = Math.min(desiredSpan, columns)

		if (span > remaining) {
			if (remaining > 0 && spans.length > 0) {
				spans[spans.length - 1] = Math.min(
					columns,
					spans[spans.length - 1] + remaining
				)
			}
			remaining = columns
		}

		spans.push(Math.min(span, remaining))
		remaining -= spans[spans.length - 1]
		if (remaining === 0) remaining = columns
	}

	// Stretch last row to fully fill the grid
	if (remaining !== columns && spans.length > 0) {
		const leftover = remaining
		spans[spans.length - 1] = Math.min(
			columns,
			spans[spans.length - 1] + leftover
		)
	}

	return spans
}

const Articles = async ({ articles }) => {
	const allArtiles = await getEntries('article')
	const articlesToRender = allArtiles.items.filter(article =>
		articles.some(a => a.sys.id === article.sys.id)
	)
	const spans = computeBentoSpans(articlesToRender, 4)

	return (
		<section style={{ backgroundColor: '#E9E9E9', margin: '0' }}>
			<Box
				className='container'
				padding={{ xs: '4rem 0', lg: '6rem 0' }}
				sx={{
					display: { xs: 'flex', lg: 'grid' },
					flexDirection: { xs: 'column', lg: 'initial' },
					gridTemplateColumns: { lg: 'repeat(4, minmax(0, 1fr))' },
					gridAutoFlow: { lg: 'dense' },
					gap: { xs: '1rem', lg: '1rem' }
				}}
			>
				{articlesToRender.map((article, index) => (
					<Box
						key={article.sys.id}
						sx={{
							width: { xs: '100%', lg: 'auto' },
							gridColumn: {
								lg: `span ${spans[index] ?? 1}`
							},
							backgroundColor: 'white',
							padding: '2rem'
						}}
						display={'flex'}
						flexDirection={'column'}
						gap={'1rem'}
					>
						<Typography
							variant='h3'
							textAlign={'left'}
							fontWeight={'300'}
							lineHeight={'1.2'}
						>
							{article.fields.title}
						</Typography>

						<Typography variant='h4'>{article.fields.subtitle}</Typography>

						<Typography variant='p'>
							{(() => {
								const t = article.fields?.shortText ?? ''
								return t.length > 150 ? t.slice(0, 150) + '...' : t
							})()}
						</Typography>
					</Box>
				))}
			</Box>
		</section>
	)
}

export default Articles
