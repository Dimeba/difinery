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

	return (
		<ConditionalLink
			fullHeight={fullHeight}
			link={content.fields.link}
			overlay={content.fields.overlay}
		>
			{content.fields.video && (
				<Video
					video={content.fields.video}
					showControls={content.fields.showControls}
				/>
			)}

			{content.fields.image && (
				<Image
					src={'https:' + content.fields.image.fields.file.url}
					alt='image'
					fill
				/>
			)}

			<div className={styles.content} style={dynamicStyles.content}>
				{content.fields.titlePosition == 'top' && (
					<>
						{content.fields.stylizedTitle ? (
							<div className='stylizedH2'>
								{documentToReactComponents(content.fields.stylizedTitle)}
							</div>
						) : (
							<h2 style={dynamicStyles.text}>{content.fields.title}</h2>
						)}
					</>
				)}

				{content.fields.text && (
					<p className={styles.text} style={dynamicStyles.text}>
						{content.fields.text}
					</p>
				)}
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

			{content.fields.titlePosition == 'below' && (
				<h4>{content.fields.title}</h4>
			)}
		</ConditionalLink>
	)
}

export default Column
