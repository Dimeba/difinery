'use client'

// styles
import styles from './Columns.module.scss'

// components
import Link from 'next/link'

const ConditionalLink = ({
	fullHeight,
	link,
	overlay,
	type,
	children,
	mobileColumns,
	height = '650px',
	fixedRatio = false,
	mediaMobileAlign = 'center'
}) => {
	const dynamicStyles = {
		backgroundColor: overlay ? 'rgba(0,0,0,0.25)' : '',
		height: fullHeight ? '100vh' : height
	}

	const returnMediaMobileAlign = () => {
		switch (mediaMobileAlign) {
			case 'center':
				return styles.mediaMobileAlignCenter
			case 'left':
				return styles.mediaMobileAlignLeft
			case 'right':
				return styles.mediaMobileAlignRight
			default:
				return ''
		}
	}

	const sharedClasses = `${styles.column} ${
		type == 'blank' ? styles.blackText : styles.whiteText
	} ${mobileColumns == 2 ? styles.columnGrid : ''} ${returnMediaMobileAlign()}`

	if (link) {
		return (
			<Link
				href={link}
				className={`${sharedClasses} ${styles.link}`}
				style={dynamicStyles}
			>
				{children}
			</Link>
		)
	} else {
		return (
			<div className={sharedClasses} style={dynamicStyles}>
				{children}
			</div>
		)
	}
}

export default ConditionalLink
