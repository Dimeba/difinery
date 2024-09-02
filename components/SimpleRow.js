// styles
import styles from './SimpleRow.module.scss'

const SimpleRow = ({ title, text, stylizedTitle }) => {
	return (
		<section>
			<div className={`container ${styles.simpleRow}`}>
				{stylizedTitle && (
					<div className='stylizedH3'>
						{documentToReactComponents(stylizedTitle)}
					</div>
				)}
				{title && !stylizedTitle && <h3>{title}</h3>}
				{text && <p>{text}</p>}
			</div>
		</section>
	)
}

export default SimpleRow
