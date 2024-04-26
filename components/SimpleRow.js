// styles
import styles from './SimpleRow.module.scss'

const SimpleRow = ({ title, text }) => {
	return (
		<section>
			<div className={`container ${styles.simpleRow}`}>
				{title && <h3>{title}</h3>}
				{text && <p>{text}</p>}
			</div>
		</section>
	)
}

export default SimpleRow
