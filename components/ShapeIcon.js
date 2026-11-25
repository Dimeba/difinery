// styles
import styles from './ShapeIcon.module.scss'

// components
import Image from 'next/image'

// Diamond shape icon (Daniela's set, data/shapes.json). The outline shows by
// default; the faceted version shows when `detailed` is set (selected) and
// while the surrounding button is hovered or focused. `dimmed` fades an
// unselected option until it is hovered.
//
// The PNGs carry a transparent margin (`iconPadding` px of `iconHeight`) so
// that image resizing (e.g. Netlify's Image CDN rounding the height down)
// never clips the outline at the edge. `size` is the height of the drawing
// itself; the margin is drawn around it with a negative margin, so it takes
// no room in the layout.
const ShapeIcon = ({ shape, size = 40, detailed, dimmed, alt = '' }) => {
	const pad = shape.iconPadding || 0
	const scale = size / (shape.iconHeight - 2 * pad)
	const height = shape.iconHeight * scale
	const width = shape.iconWidth * scale
	const margin = pad * scale

	return (
		<span
			className={`${styles.icon} ${detailed ? styles.detailed : ''} ${
				dimmed ? styles.dimmed : ''
			}`}
			style={{ width, height, margin: -margin }}
		>
			<Image
				src={shape.outline}
				alt={alt}
				width={shape.iconWidth}
				height={shape.iconHeight}
				sizes={`${Math.ceil(width)}px`}
				className={styles.outline}
			/>
			<Image
				src={shape.detail}
				alt=''
				width={shape.iconWidth}
				height={shape.iconHeight}
				sizes={`${Math.ceil(width)}px`}
				className={styles.detail}
			/>
		</span>
	)
}

export default ShapeIcon
