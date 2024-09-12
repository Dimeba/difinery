'use client'

// styles
import styles from './Columns.module.scss'

// components
import Link from 'next/link'

const ConditionalLink = ({ fullHeight, link, children }) => {
	if (link) {
		return (
			<Link
				href={link}
				className={`${styles.column} ${styles.link}`}
				style={{ height: fullHeight ? '100vh' : '650px' }}
			>
				{children}
			</Link>
		)
	} else {
		return (
			<div
				className={styles.column}
				style={{ height: fullHeight ? '100vh' : '650px' }}
			>
				{children}
			</div>
		)
	}
}

export default ConditionalLink
