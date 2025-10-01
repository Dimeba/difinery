// styles
import styles from './Features.module.scss'

// components
import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

// lib
import { getEntriesByIds } from '@/lib/contentful'

const Features = async ({
	features,
	title,
	stylizedTitle,
	h4text,
	description,
	borderTop
}) => {
	let content = []
	if (features && features.length) {
		const ids = features.map(f => f.sys.id)
		const { items } = await getEntriesByIds(ids)
		content = items
	}

	return (
		<Box
			component='section'
			sx={{
				borderTop: borderTop ? '1px solid #E8E8E8' : 'none',
				paddingTop: { xs: '4rem', lg: '6rem' }
			}}
		>
			<div className={`container ${styles.content}`}>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '1rem',
						alignItems: 'center'
					}}
				>
					{stylizedTitle ? (
						<div className={`stylizedH3 ${styles.sectionTitle}`}>
							{documentToReactComponents(stylizedTitle)}
						</div>
					) : (
						<h3>{title}</h3>
					)}

					{description && (
						<Typography
							variant='p'
							textAlign='center'
							maxWidth={{ xs: '100%', lg: '60%' }}
						>
							{description}
						</Typography>
					)}
				</Box>

				<Box
					display='flex'
					justifyContent='center'
					flexWrap='wrap'
					width='100%'
					rowGap='4rem'
					columnGap='2rem'
					flexDirection={{
						xs: content.length > 8 ? 'row' : 'column',
						lg: 'row'
					}}
				>
					{content.map(item => (
						<Box
							key={item.sys.id}
							className={styles.column}
							sx={{
								minWidth: {
									xs: 'calc(50% - 2rem)',
									lg: content.length > 8 ? 'calc(16.6% - 2rem)' : ''
								},
								maxWidth: {
									xs: '100%',
									lg: 'calc(20% - 2rem)'
								}
							}}
						>
							{item.fields.topText && <h4>{item.fields.topText}</h4>}

							{item.fields.image && (
								<Image
									src={'https:' + item.fields.image.fields.file.url}
									alt='Icon'
									width={54}
									height={54}
									style={{ objectFit: 'contain', objectPosition: 'center' }}
								/>
							)}
							{item.fields.number && <h2>{item.fields.number}</h2>}
							{h4text ? <h4>{item.fields.text}</h4> : <p>{item.fields.text}</p>}
						</Box>
					))}
				</Box>
			</div>
		</Box>
	)
}

export default Features
