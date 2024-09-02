// styles
import styles from './Banner.module.scss'

// components
import Button from './Button'
import Image from 'next/image'
import Video from './Video'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

// lib
import { getEntry } from '@/lib/contentful'

const Banner = async ({
	video,
	image,
	title,
	stylizedTitle,
	text,
	links,
	top,
	showControls
}) => {
	const buttons = []

	if (links) {
		for (let i = 0; i < links.length; i++) {
			const link = await getEntry(links[i].sys.id)
			buttons.push(link)
		}
	}

	return (
		<section className={`${styles.banner} ${top ? styles.top : ''}`}>
			{video && <Video video={video} showControls={showControls} />}

			{image && (
				<Image src={'https:' + image.fields.file.url} alt='image' fill />
			)}

			<div className={`container ${styles.content}`}>
				{stylizedTitle && (
					<div className='stylizedH2'>
						{documentToReactComponents(stylizedTitle)}
					</div>
				)}
				{title && !stylizedTitle && <h2>{title}</h2>}

				{text && <p>{text}</p>}
				{links && (
					<div className={styles.buttons}>
						{buttons.map(button => (
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
		</section>
	)
}

export default Banner
