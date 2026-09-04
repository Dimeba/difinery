// components
import ArticleHeader from '@/components/blank-canvas/ArticleHeader'
import ArticleCoverImage from '@/components/blank-canvas/ArticleCoverImage'
import ArticleContent from '@/components/blank-canvas/ArticleContent'
import { notFound } from 'next/navigation'

// lib
import { getEntries } from '@/lib/contentful'

const articles = await getEntries('blankCanvasArticle')

const slugify = artistName =>
	artistName
		.toLowerCase()
		.replace(/[^a-z0-9 ]/gi, '')
		.replace(/&/g, '')
		.trim()
		.replace(/ +/g, '-')

export async function generateStaticParams() {
	return articles.items
		.filter(article => article.fields.artistName)
		.map(article => ({
			artistName: slugify(article.fields.artistName)
		}))
}

export async function generateMetadata(props) {
	const params = await props.params
	const { artistName } = params

	const matchedArticle = articles.items.find(
		article => slugify(article.fields.artistName) === artistName
	)

	if (!matchedArticle) {
		return { title: 'Difinery | Page not found' }
	}

	const content = matchedArticle.fields
	const rawShareImageUrl = content?.shareImage?.fields?.file?.url
	const shareImageUrl = rawShareImageUrl
		? rawShareImageUrl.startsWith('//')
			? `https:${rawShareImageUrl}`
			: rawShareImageUrl
		: null

	return {
		title: `Difinery | Blank Canvas Community / ${content.artistName}`,
		description: content.description ? content.description : '',
		keywords: content.keywords ? content.keywords : '',
		openGraph: {
			images: shareImageUrl ? [{ url: shareImageUrl }] : []
		},
		twitter: {
			card: 'summary_large_image',
			images: shareImageUrl ? [shareImageUrl] : []
		}
	}
}

export default async function BlankCanvasArtistPage(props) {
	const params = await props.params
	const { artistName } = params

	const matchedArticle = articles.items.find(
		article => slugify(article.fields.artistName) === artistName
	)

	if (!matchedArticle) {
		notFound()
	}

	const content = matchedArticle.fields

	return (
		<main>
			<ArticleHeader
				title={content.title}
				artistName={content.artistName}
				artistTitle={content.artistTitle}
			/>
			<ArticleCoverImage
				coverImage={content.coverImage}
				articleTitle={content.title}
			/>
			<ArticleContent content={content.content} />
		</main>
	)
}
