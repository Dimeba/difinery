// styles
import styles from './ArticleHeader.module.scss'

// components
import { Typography } from '@mui/material'

const ArticleHeader = ({ title, artistName, artistTitle }) => {
	return (
		<section className={`topSection ${styles.header}`}>
			<div className={`container ${styles.content}`}>
				<Typography
					variant='p'
					component='p'
					className={styles.eyebrow}
					sx={{ fontSize: '12px', fontWeight: 700 }}
				>
					THE BLANK CANVAS COMMUNITY
				</Typography>

				<Typography variant='h1' component='h1' className={styles.title}>
					{title}
				</Typography>

				<Typography variant='p' component='p' className={styles.subtitle}>
					In conversation with {artistName}, {artistTitle}
				</Typography>
			</div>
		</section>
	)
}

export default ArticleHeader
