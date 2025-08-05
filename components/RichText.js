// styles
import styles from './RichText.module.scss'

// components
import { Box, Typography } from '@mui/material'

// hooks
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

const RichText = ({ title, content, index, thin }) => {
	return (
		<section className={`${index == 0 ? 'topSection' : ''}`}>
			<Box
				width={'90vw'}
				maxWidth={thin ? '482px' : '1440px'}
				margin={'0 auto'}
				height={'100%'}
				className={styles.content}
			>
				<Typography variant='h2' sx={{ textWrap: 'balance' }}>
					{title}
				</Typography>
				{documentToReactComponents(content)}
			</Box>
		</section>
	)
}

export default RichText
