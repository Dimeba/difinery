// styles
import styles from './Banner.module.scss'

// components
import Button from './Button'
import Image from 'next/image'
import Video from './Video'

// lib
import { getEntry } from '@/lib/contentful'

const Banner = async ({
	video,
	image,
	title,
	text,
	links,
	top,
	showControls
}) => {
	const getLink = async id => {
		const link = await getEntry(id)
		return link
	}

	const buttons = []

	if (links) {
		for (let i = 0; i < links.length; i++) {
			const link = await getLink(links[i].sys.id)
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
				{title && <h2>{title}</h2>}
				{text && <p>{text}</p>}
				{links && (
					<div className={styles.buttons}>
						{buttons.map((button, index) => (
							<Button
								key={index}
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
