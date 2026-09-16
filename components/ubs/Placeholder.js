// styles
import styles from './Ubs.module.scss'

// Temporary stand-in for images and icons until final assets are provided
const Placeholder = ({ label = 'Image', className = '', dark = false }) => {
	return (
		<div
			className={`${styles.placeholder} ${dark ? styles.placeholderDark : ''} ${className}`}
			aria-hidden='true'
		>
			<span>{label}</span>
		</div>
	)
}

export default Placeholder
