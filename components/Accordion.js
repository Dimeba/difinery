'use client'

// styles
import styles from './Accordion.module.scss'

// components
import Image from 'next/image'
import InfoIcon from '@mui/icons-material/Info'

// hooks
import { useState, useEffect, useId } from 'react'
import { useMediaQuery } from '@/lib/mui'

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
	helpLink = '/',
	extraClass = ''
}) => {
	const [rowOpen, setRowOpen] = useState(state ? state : false)
	const isMobile = useMediaQuery('(max-width: 1024px)')
	const contentId = useId()
	// const [showHelpDropdown, setShowHelpDropdown] = useState(false)

	useEffect(() => {
		if (!disabled) {
			setRowOpen(state)
		} else if (disabled && isMobile) {
			setRowOpen(false)
		} else {
			setRowOpen(true)
		}
	}, [state, disabled, isMobile])

	const canToggle = !disabled || isMobile

	const toggleRow = () => {
		if (canToggle) {
			rowOpen ? setRowOpen(false) : setRowOpen(true)
			setOpenOption && setOpenOption()
		}
	}

	const handleTitleKeyDown = e => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			toggleRow()
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
				{/* The title row is the toggle. Its h4 is only for the look: these are
				    UI labels, not part of the page's heading outline. */}
				<div
					className={styles.title}
					onClick={toggleRow}
					role={canToggle ? 'button' : undefined}
					tabIndex={canToggle ? 0 : undefined}
					aria-expanded={canToggle ? rowOpen : undefined}
					aria-controls={canToggle ? contentId : undefined}
					onKeyDown={canToggle ? handleTitleKeyDown : undefined}
				>
					{small ? (
						<p>{title}</p>
					) : (
						<h4 role='none'>
							{title}
							{extraTitleText && (
								<span style={{ fontWeight: '400', color: '#767676' }}>
									{' '}
									/ {extraTitleText}
								</span>
							)}
						</h4>
					)}

					<Image
						src='/arrow.svg'
						alt=''
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

				{/* A plain <a>: next/link would prefetch the (1 MB) size guide PDF. */}
				{showHelp && (
					<a href={helpLink} target='_blank' rel='noopener noreferrer'>
						<div
							className={styles.needHelpButton}
							// onClick={() => setShowHelpDropdown(!showHelpDropdown)}
						>
							<InfoIcon fontSize='8px' />
							<p>Need help?</p>
						</div>
					</a>
				)}

				{/* {showHelpDropdown && helpContent} */}
			</div>
			<div className={styles.contentContainer}>
				<div
					id={contentId}
					className={styles.content}
					style={{ display: rowOpen ? 'flex' : 'none' }}
					// onClick={() => setShowHelpDropdown(false)}
				>
					{children}
				</div>
			</div>
		</div>
	)
}

export default Accordion
