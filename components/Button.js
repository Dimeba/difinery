'use client'

// styles
import styles from './Button.module.scss'

// components
import Link from 'next/link'

const Button = ({ text, link, white, disabled, newWindow, fullWidth }) => {
	const handleClick = e => {
		if (disabled) {
			e.preventDefault()
			return
		}
	}

	return (
		<Link
			href={link}
			aria-label={text + ' link'}
			target={newWindow ? '_blank' : '_self'}
		>
			<div
				className={`${styles.button} ${
					white ? styles.buttonWhite : styles.buttonBlack
				} ${disabled ? styles.disabled : ''} ${
					fullWidth ? styles.fullWidth : ''
				}`}
				onClick={handleClick}
			>
				<p>{text}</p>
			</div>
		</Link>
	)
}

export default Button
