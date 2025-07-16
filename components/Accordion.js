'use client'

// styles
import styles from './Accordion.module.scss'

// components
import Image from 'next/image'
import InfoIcon from '@mui/icons-material/Info'

// hooks
import { useState, useEffect } from 'react'
import { useMediaQuery } from '@mui/material'

const Accordion = ({
	state,
	title,
	extraTitleText = null,
	children,
	small,
	product,
	display,
	setOpenOption,
	hideBorder = false,
	disabled = false,
	showHelp = false,
	helpContent = null,
	extraClass = ''
}) => {
	const [rowOpen, setRowOpen] = useState(state ? state : false)
	const isMobile = useMediaQuery('(max-width: 1024px)')
	const [showHelpDropdown, setShowHelpDropdown] = useState(false)

	useEffect(() => {
		if (!disabled) {
			setRowOpen(state)
		} else if (disabled && isMobile) {
			setRowOpen(false)
		} else {
			setRowOpen(true)
		}
	}, [state, disabled, isMobile])

	const toggleRow = () => {
		if (!disabled || isMobile) {
			rowOpen ? setRowOpen(false) : setRowOpen(true)
			setOpenOption && setOpenOption()
		}
	}

	return (
		<div
			className={`${styles.accordion} ${
				hideBorder ? styles.hiddenBorder : ''
			} ${extraClass}`}
			style={
				product && { display: display ? 'block' : 'none', padding: '2.2rem 0' }
			}
		>
			<div className={`${styles.titleRow} ${rowOpen ? styles.open : ''}`}>
				<div className={styles.title} onClick={toggleRow}>
					{small ? (
						<p>{title}</p>
					) : (
						<h4>
							{title}
							{extraTitleText && (
								<span style={{ fontWeight: '400', color: '#9b9b9b' }}>
									{' '}
									/ {extraTitleText}
								</span>
							)}
						</h4>
					)}

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
						className={`${styles.icon} ${disabled ? styles.hidden : ''}`}
					/>
				</div>

				{showHelp && (
					<div
						className={styles.needHelpButton}
						onClick={() => setShowHelpDropdown(!showHelpDropdown)}
					>
						<InfoIcon fontSize='8px' />
						<p>Need help?</p>
					</div>
				)}

				{showHelpDropdown && helpContent}
			</div>
			<div className={styles.contentContainer}>
				<div
					className={styles.content}
					style={{ display: rowOpen ? 'flex' : 'none' }}
					onClick={() => setShowHelpDropdown(false)}
				>
					{children}
				</div>
			</div>
		</div>
	)
}

export default Accordion
