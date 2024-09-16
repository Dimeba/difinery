// styles
import styles from './RichText.module.scss'

// hooks
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

const RichText = ({ title, content, index }) => {
	return (
		<section className={`${index == 0 ? 'topSection' : ''}`}>
			<div className={`container ${styles.content}`}>
				<h2>{title}</h2>
				{documentToReactComponents(content)}
			</div>
		</section>
	)
}

export default RichText
