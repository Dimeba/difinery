// styles
import styles from './ColumnsContent.module.scss'

// components
import Image from 'next/image'
import Button from './Button'

// lib
import { getEntry } from '@/lib/contentful'

const ColumnsContent = async ({ reverse, title, text, links, image }) => {
	const buttons = []

	if (links) {
		for (let i = 0; i < links.length; i++) {
			const link = await getEntry(links[i].sys.id)
			buttons.push(link)
		}
	}

	return (
		<section
			className={styles.columnsContent}
			style={{ flexDirection: reverse ? 'row-reverse' : 'row' }}
		>
			<div className={styles.image}>
				<Image
					src={'https:' + image.fields.file.url}
					fill
					alt='Banner Image.'
					style={{ objectFit: 'cover' }}
				/>
			</div>
			<div
				className={styles.content}
				style={{ justifyContent: reverse ? 'flex-end' : 'flex-start' }}
			>
				<div>
					<h3>{title}</h3>
					<p>{text}</p>
					{links && (
						<div className={styles.buttons}>
							{buttons.map(button => (
								<Button
									key={button.sys.id}
									text={button.fields.text}
									link={button.fields.url}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</section>
	)
}

export default ColumnsContent
