// styles
import styles from './ArticleContent.module.scss'

// components
import Image from 'next/image'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS } from '@contentful/rich-text-types'

const richTextOptions = {
	renderNode: {
		[BLOCKS.EMBEDDED_ASSET]: node => {
			const { title, file } = node.data.target.fields || {}
			if (!file?.url) return null

			const src = file.url.startsWith('//') ? `https:${file.url}` : file.url

			return (
				<div className={styles.imageWrap}>
					<Image
						src={src}
						alt={title || file.fileName || ''}
						fill
						sizes='(max-width: 1440px) 90vw, 1440px'
						className={styles.image}
					/>
				</div>
			)
		}
	}
}

const renderNodes = nodes =>
	documentToReactComponents(
		{
			nodeType: 'document',
			data: {},
			content: nodes
		},
		richTextOptions
	)

// Group h4 + following paragraphs into Q&A rows.
// Breaks on the next h4, quote, image, or any non-paragraph.
const groupNodes = nodes => {
	const groups = []
	let i = 0

	while (i < nodes.length) {
		const node = nodes[i]

		if (node.nodeType === BLOCKS.HEADING_4) {
			const heading = node
			const paragraphs = []
			i++

			while (i < nodes.length && nodes[i].nodeType === BLOCKS.PARAGRAPH) {
				paragraphs.push(nodes[i])
				i++
			}

			groups.push({ type: 'qa', heading, paragraphs })
			continue
		}

		groups.push({ type: 'block', node })
		i++
	}

	return groups
}

const ArticleContent = ({ content }) => {
	if (!content?.content?.length) return null

	const groups = groupNodes(content.content)

	return (
		<section>
			<div className={`container ${styles.content}`}>
				{groups.map((group, index) => {
					if (group.type === 'qa') {
						return (
							<div key={index} className={styles.qaRow}>
								<div className={styles.qaHeading}>
									{renderNodes([group.heading])}
								</div>
								<div className={styles.qaBody}>
									{renderNodes(group.paragraphs)}
								</div>
							</div>
						)
					}

					return (
						<div key={index} className={styles.block}>
							{renderNodes([group.node])}
						</div>
					)
				})}
			</div>
		</section>
	)
}

export default ArticleContent
