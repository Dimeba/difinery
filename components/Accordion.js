'use client'

// styles
import styles from './Accordion.module.scss'

// components
import Image from 'next/image'

// hooks
import { useState, useEffect } from 'react'

const Accordion = ({
	state,
	title,
	children,
	small,
	product,
	display,
	setOpenOption
}) => {
	const [rowOpen, setRowOpen] = useState(state ? state : false)

	useEffect(() => {
		setRowOpen(state)
	}, [state])

	const toggleRow = () => {
		rowOpen ? setRowOpen(false) : setRowOpen(true)
		setOpenOption && setOpenOption()
	}

	return (
		<div
			className={styles.accordion}
			style={product && { display: display ? 'block' : 'none' }}
		>
			<div
				className={`${styles.titleRow} ${rowOpen ? styles.open : ''}`}
				onClick={toggleRow}
			>
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
			<div className={styles.contentContainer}>
				<div
					className={styles.content}
					style={{ display: rowOpen ? 'flex' : 'none' }}
				>
					{children}
				</div>
			</div>
		</div>
	)
}

export default Accordion
