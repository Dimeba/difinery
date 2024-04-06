// styles
import styles from './Button.module.scss'

// components
import Link from 'next/link'

const Button = ({ text, link, white }) => {
	return (
		<Link href={link} aria-label={text + ' link'}>
			<div
				className={`${styles.button} ${
					white ? styles.buttonWhite : styles.buttonBlack
				}`}
			>
				<p>{text}</p>
			</div>
		</Link>
	)
}

export default Button
