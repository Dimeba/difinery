// styles
import styles from './ShapeIcon.module.scss'

// components
import Image from 'next/image'

// Diamond shape icon (Daniela's set, data/shapes.json). The outline shows by
// default; the faceted version shows when `detailed` is set (selected) and
// while the surrounding button is hovered or focused. `dimmed` fades an
// unselected option until it is hovered.
const ShapeIcon = ({ shape, size = 40, detailed, dimmed, alt = '' }) => {
	const width = Math.round((size * shape.iconWidth) / shape.iconHeight)

	return (
		<span
			className={`${styles.icon} ${detailed ? styles.detailed : ''} ${
				dimmed ? styles.dimmed : ''
			}`}
			style={{ width, height: size }}
		>
			<Image
				src={shape.outline}
				alt={alt}
				width={shape.iconWidth}
				height={shape.iconHeight}
				sizes={`${width}px`}
				className={styles.outline}
			/>
			<Image
				src={shape.detail}
				alt=''
				width={shape.iconWidth}
				height={shape.iconHeight}
				sizes={`${width}px`}
				className={styles.detail}
			/>
		</span>
	)
}

export default ShapeIcon
