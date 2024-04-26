// styles
import styles from './ColumnsContent.module.scss'

// components
import Image from 'next/image'
import Button from './Button'

const ColumnsContent = ({
	reverse,
	title,
	text,
	buttonText,
	buttonUrl,
	image
}) => {
	return (
		<section
			className={styles.columnsContent}
			style={{ flexDirection: reverse ? 'row-reverse' : 'row' }}
		>
			<div className={styles.image}>
				<Image
					src={image}
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
					<Button link={buttonUrl} text={buttonText} />
				</div>
			</div>
		</section>
	)
}

export default ColumnsContent
