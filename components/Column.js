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

const Column = async ({ fullHeight, id, columns, mobileColumns = 1 }) => {
	const content = await getEntry(id)

	// dynamic styles
	const horizontalAlign = () => {
		switch (content.fields.contentAlignHorizontal) {
			case 'center':
				return 'center'
			case 'right':
				return 'flex-end'
			default:
				return 'flex-start'
		}
	}

	const dynamicStyles = {
		content: {
			alignItems: horizontalAlign(),
			justifyContent:
				content.fields.contentAlignVertical == 'center' ? 'center' : 'flex-end',
			maxWidth: columns == 1 ? '1440px' : `${1440 / columns}px`
		}
	}

	// text alignment
	const textAlignClassName = () => {
		switch (content.fields.contentAlignHorizontal) {
			case 'center':
				return styles.centerAlign
			case 'right':
				return styles.rightAlign
			default:
				return styles.leftAlign
		}
	}

	// text width
	const textWidth = columns == 1 ? styles.third : ''

	return (
		<ConditionalLink
			fullHeight={fullHeight}
			link={content.fields.link}
			overlay={content.fields.overlay}
			type={content.fields.type}
			mobileColumns={mobileColumns}
		>
			{content.fields.type == 'video' && (
				<Video
					video={content.fields.media}
					// showControls={content.fields.showControls}
					showControls={content.fields.showVideoControls || false}
					autoPlay={content.fields.autoPlay || false}
					mute={content.fields.mute}
				/>
			)}

			{content.fields.type == 'image' && (
				<Image
					src={'https:' + content.fields.media.fields.file.url}
					alt='image'
					fill
					style={{ objectFit: content.fields.fitImage ? 'contain' : 'cover' }}
					sizes={
						columns == 1
							? '(max-width: 1920px) 100vw, 75vw'
							: '(max-width: 768px) 100vw, 50vw'
					}
				/>
			)}

			<div className={styles.content} style={dynamicStyles.content}>
				{/* Text */}
				{content.fields.text && content.fields.textPosition == 'top' && (
					<div
						className={` ${textAlignClassName()} ${styles.text} ${textWidth}`}
					>
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
								white={content.fields.type == 'blank' ? false : true}
							/>
						))}
					</div>
				)}
			</div>

			{content.fields.text && content.fields.textPosition == 'below' && (
				<div className={`${styles.belowText} ${textAlignClassName()}`}>
					{documentToReactComponents(content.fields.text)}
				</div>
			)}
		</ConditionalLink>
	)
}

export default Column
