// styles
import styles from './ArticleCoverImage.module.scss'

// components
import Image from 'next/image'

const ArticleCoverImage = ({ coverImage, articleTitle }) => {
	const fileUrl = coverImage?.fields?.file?.url
	if (!fileUrl) return null

	const src = fileUrl.startsWith('//') ? `https:${fileUrl}` : fileUrl

	return (
		<section className={styles.cover}>
			<Image
				src={src}
				alt={`${articleTitle} cover image`}
				fill
				priority
				sizes='100vw'
				className={styles.image}
			/>
		</section>
	)
}

export default ArticleCoverImage
