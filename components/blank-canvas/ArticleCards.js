// components
import Image from 'next/image'
import Link from 'next/link'
import { Typography } from '@/lib/mui'

// lib
import { getEntries } from '@/lib/contentful'
import { blankCanvasSlug, readTimeMinutes } from '@/lib/blankCanvas'

// styles
import styles from './ArticleCards.module.scss'

const assetUrl = asset => {
	const url = asset?.fields?.file?.url
	if (!url) return null
	return url.startsWith('//') ? `https:${url}` : url
}

// Card row of every Blank Canvas article, newest first.
const ArticleCards = async ({ title = 'Latest Artists' }) => {
	const articles = await getEntries('blankCanvasArticle')
	const items = articles.items
		.filter(article => article.fields.artistName)
		.sort((a, b) => new Date(b.sys.createdAt) - new Date(a.sys.createdAt))

	if (items.length === 0) return null

	return (
		<section className={styles.section}>
			<div className='container'>
				<Typography variant='h3' fontWeight={300} marginBottom={'4rem'}>
					{title}
				</Typography>
			</div>

			<ul className={styles.track}>
				{items.map(article => {
					const { title, artistName, coverImage, content } = article.fields
					const imageUrl = assetUrl(coverImage)
					const minutes = readTimeMinutes(content)

					return (
						<li key={article.sys.id} className={styles.item}>
							<Link
								href={`/blank-canvas/${blankCanvasSlug(artistName)}`}
								className={styles.card}
							>
								<div className={styles.media}>
									{imageUrl && (
										<Image
											src={imageUrl}
											alt={coverImage.fields.description || artistName}
											fill
											sizes='(max-width: 600px) 80vw, (max-width: 1024px) 45vw, 30vw'
										/>
									)}
								</div>
								<div className={styles.body}>
									<Typography
										variant='h3'
										component='h3'
										fontWeight={300}
										textAlign='left'
										className={styles.cardTitle}
									>
										{title}
									</Typography>
									<p className={styles.artist}>{artistName}</p>
									<span className={styles.readTime}>
										{minutes} Minute Read
									</span>
								</div>
							</Link>
						</li>
					)
				})}
			</ul>
		</section>
	)
}

export default ArticleCards
