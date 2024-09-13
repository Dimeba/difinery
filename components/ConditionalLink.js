'use client'

import dynamic from 'next/dynamic'
// styles
import styles from './Columns.module.scss'

// components
import Link from 'next/link'

const ConditionalLink = ({ fullHeight, link, overlay, type, children }) => {
	const dynamicStyles = {
		backgroundColor: overlay ? 'rgba(0,0,0,0.25)' : ''
	}

	const sharedClasses = `${styles.column} ${
		fullHeight ? styles.fullHeight : styles.defaultHeight
	} ${type == 'blank' ? styles.blackText : styles.whiteText}`

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
