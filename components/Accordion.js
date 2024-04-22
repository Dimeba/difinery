'use client'

// styles
import styles from './Accordion.module.scss'

// components
import Image from 'next/image'

// hooks
import { useState } from 'react'

const Accordion = ({ state, title, children, small }) => {
	const [rowOpen, setRowOpen] = useState(state ? state : false)

	const toggleRow = () => {
		rowOpen ? setRowOpen(false) : setRowOpen(true)
	}

	return (
		<div className={styles.accordion} onClick={toggleRow}>
			<div className={`${styles.titleRow} ${rowOpen ? styles.open : ''}`}>
				{small ? <p>{title}</p> : <h4>{title}</h4>}

				<Image
					src='/arrow.svg'
					alt='Arrow Button'
					width={12}
					height={12}
					style={{
						cursor: 'pointer',
						objectFit: 'contain',
						objectPosition: 'center'
					}}
					className={styles.icon}
				/>
			</div>
			<div
				className={styles.content}
				style={{ display: rowOpen ? 'flex' : 'none' }}
			>
				{children}
			</div>
		</div>
	)
}

export default Accordion
