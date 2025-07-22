// styles
import styles from './Columns.module.scss'

// components
import Button from './Button'
import Image from 'next/image'
import Video from './Video'
import ConditionalLink from './ConditionalLink'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
import { Box } from '@mui/material'

// lib
import { getEntry } from '@/lib/contentful'

const Column = async ({
	fullHeight,
	id,
	columns,
	mobileColumns = 1,
	height = '650px'
}) => {
	const content = await getEntry(id)

	// dynamic styles
	const horizontalAlignDesktop = () => {
		switch (content.fields.contentAlignHorizontal) {
			case 'center':
				return 'center'
			case 'right':
				return 'flex-end'
			default:
				return 'flex-start'
		}
	}

	const horizontalAlignMobile = () => {
		switch (content.fields.contentAlignHorizontal) {
			case 'center':
				return 'center'
			case 'right':
				return 'flex-start'
			default:
				return 'flex-start'
		}
	}

	const dynamicStyles = {
		content: {
			justifyContent:
				content.fields.contentAlignVertical == 'center' ? 'center' : 'flex-end',
			maxWidth: columns == 1 ? '1440px' : ``,
			width: columns == 1 ? '90%' : '100%',
			paddingTop: content.fields.noPadding === true ? '0' : '',
			paddingBottom: content.fields.noPadding === true ? '0' : '',
			paddingLeft: columns > 1 ? '4rem' : '',
			paddingRight: columns > 1 ? '4rem' : ''
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

	// extracting image from rich text
	const richTextOptions = {
		renderNode: {
			[BLOCKS.EMBEDDED_ASSET]: node => {
				const { title, file } = node.data.target.fields
				// prepend protocol if missing
				const src = file.url.startsWith('//') ? `https:${file.url}` : file.url
				return (
					<Box display='flex' justifyContent='center' width='100%' mb={2}>
						<Image
							src={src}
							alt={title || file.fileName}
							width={54}
							height={54}
						/>
					</Box>
				)
			}
		}
	}

	const isPng = content.fields.media?.fields?.file?.contentType === 'image/png'

	return (
		<ConditionalLink
			fullHeight={fullHeight}
			link={content.fields.link}
			overlay={content.fields.overlay}
			type={content.fields.type}
			mobileColumns={mobileColumns}
			height={content.fields.noPadding ? 'fit-content' : height}
			fixedRatio={content.fields.fixedRatio}
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
					style={{
						objectFit: content.fields.fitImage ? 'contain' : 'cover',
						backgroundColor: isPng ? '#F5F5F5' : ''
					}}
					quality={100}
					sizes={
						columns == 1
							? '(max-width: 1920px) 100vw, 75vw'
							: '(max-width: 768px) 100vw, 50vw'
					}
				/>
			)}

			<Box
				sx={{
					alignItems: {
						xs: horizontalAlignMobile(),
						md: horizontalAlignDesktop()
					}
				}}
				className={styles.content}
				style={dynamicStyles.content}
			>
				{/* Text */}
				{content.fields.text && content.fields.textPosition == 'top' && (
					<div
						className={` ${textAlignClassName()} ${styles.text} ${textWidth}`}
					>
						{documentToReactComponents(content.fields.text, richTextOptions)}
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
			</Box>

			{content.fields.text && content.fields.textPosition == 'below' && (
				<div className={`${styles.belowText} ${textAlignClassName()}`}>
					{documentToReactComponents(content.fields.text)}
				</div>
			)}
		</ConditionalLink>
	)
}

export default Column
