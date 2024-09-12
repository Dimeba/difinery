'use client'

import dynamic from 'next/dynamic'
// styles
import styles from './Columns.module.scss'

// components
import Link from 'next/link'

const ConditionalLink = ({ fullHeight, link, overlay, children }) => {
	const dynamicStyles = {
		backgroundColor: overlay ? 'rgba(0,0,0,0.25)' : ''
	}

	if (link) {
		return (
			<Link
				href={link}
				className={`${styles.column} ${styles.link} ${
					fullHeight ? styles.fullHeight : styles.defaultHeight
				}`}
				style={dynamicStyles}
			>
				{children}
			</Link>
		)
	} else {
		return (
			<div
				className={`${styles.column}  ${
					fullHeight ? styles.fullHeight : styles.defaultHeight
				}`}
				style={dynamicStyles}
			>
				{children}
			</div>
		)
	}
}

export default ConditionalLink
