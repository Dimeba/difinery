// styles
import styles from './Columns.module.scss'

// components
import Button from './Button'
import Image from 'next/image'
import Video from './Video'
import ConditionalLink from './ConditionalLink'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

// lib
import { getEntry } from '@/lib/contentful'

const Column = async ({ fullHeight, id }) => {
	const content = await getEntry(id)

	// dynamic styles
	const dynamicStyles = {
		content: {
			alignItems:
				content.fields.contentAlign == 'center' ? 'center' : 'flex-start'
		},
		text: {
			textAlign: content.fields.contentAlign == 'center' ? 'center' : 'left'
		}
	}

	// text alignment
	const textAlignClassName =
		content.fields.contentAlign == 'center'
			? styles.centerAlign
			: styles.leftAlign

	return (
		<ConditionalLink
			fullHeight={fullHeight}
			link={content.fields.link}
			overlay={content.fields.overlay}
			type={content.fields.type}
		>
			{content.fields.type == 'video' && (
				<Video
					video={content.fields.media}
					// showControls={content.fields.showControls}
					showControls={true}
				/>
			)}

			{content.fields.type == 'image' && (
				<Image
					src={'https:' + content.fields.media.fields.file.url}
					alt='image'
					fill
				/>
			)}

			<div className={styles.content} style={dynamicStyles.content}>
				{/* Text */}
				{content.fields.text && content.fields.textPosition == 'top' && (
					<div className={`${styles.text} ${textAlignClassName}`}>
						{documentToReactComponents(content.fields.text)}
					</div>
				)}

				{/* Buttons */}
				{content.fields.links && (
					<div className={styles.buttons}>
						{content.fields.links.map(button => (
							<Button
								key={button.sys.id}
								text={button.fields.text}
								link={button.fields.url}
								white
							/>
						))}
					</div>
				)}
			</div>

			{content.fields.text && content.fields.textPosition == 'below' && (
				<div className={`${styles.belowText} ${textAlignClassName}`}>
					{documentToReactComponents(content.fields.text)}
				</div>
			)}
		</ConditionalLink>
	)
}

export default Column
