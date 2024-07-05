// styles
import styles from './RichText.module.scss'

// hooks
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

const RichText = ({ title, content }) => {
	return (
		<section>
			<div className={`container ${styles.content}`}>
				<h2>{title}</h2>
				{documentToReactComponents(content)}
			</div>
		</section>
	)
}

export default RichText
