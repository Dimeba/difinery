'use client'

// styles
import styles from './Button.module.scss'

// components
import Link from 'next/link'

const Button = ({
	text,
	link,
	white,
	disabled,
	newWindow,
	fullWidth,
	type = 'button'
}) => {
	const handleClick = e => {
		if (disabled) {
			e.preventDefault()
			return
		}
	}

	const className = `${styles.button} ${
		white ? styles.buttonWhite : styles.buttonBlack
	} ${disabled ? styles.disabled : ''} ${fullWidth ? styles.fullWidth : ''}`

	// No link: render a plain button (e.g. placeholder CTAs or form submits)
	if (!link) {
		return (
			<button type={type} className={className} disabled={disabled}>
				<p>{text}</p>
			</button>
		)
	}

	return (
		<Link
			href={link}
			aria-label={text + ' link'}
			target={newWindow ? '_blank' : '_self'}
		>
			<div className={className} onClick={handleClick}>
				<p>{text}</p>
			</div>
		</Link>
	)
}

export default Button
