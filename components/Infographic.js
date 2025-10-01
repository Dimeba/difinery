// components
import { Box, Grid, Typography } from '@mui/material'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import Image from 'next/image'

// lib
import { getEntriesByIds } from '@/lib/contentful'

const Infographic = async ({ title, stylizedTitle, features, graphic }) => {
	let content = []
	if (features && features.length) {
		const ids = features.map(f => f.sys.id)
		const { items } = await getEntriesByIds(ids)
		content = items
	}

	return (
		<section>
			<Box
				className='container'
				display='flex'
				flexDirection='column'
				gap='4rem'
			>
				{/* Title */}
				{stylizedTitle ? (
					<div className={`stylizedH3 ${styles.sectionTitle}`}>
						{documentToReactComponents(stylizedTitle)}
					</div>
				) : (
					<h3>{title}</h3>
				)}

				{/* Graphic */}
				<Grid container rowSpacing='2rem' position='relative'>
					{content.map((feature, index) => (
						<Grid
							size={{ xs: 12, lg: 6 }}
							display='flex'
							flexDirection='column'
							key={feature.sys.id}
							alignItems={{
								xs: 'center',
								lg: index % 2 === 0 ? 'flex-start' : 'flex-end'
							}}
						>
							<Typography
								variant='h3'
								textAlign={{
									xs: 'center',
									lg: index % 2 === 0 ? 'left' : 'right'
								}}
								sx={{
									borderBottom: '1px solid black',
									marginBottom: '1rem',
									width: '100%'
								}}
							>
								{feature.fields.number}
							</Typography>

							<Typography
								variant='p'
								textAlign={{
									xs: 'center',
									lg: index % 2 === 0 ? 'left' : 'right'
								}}
								sx={{
									maxWidth: { xs: '100%', lg: '66%' },
									textWrap: 'balance'
								}}
							>
								{feature.fields.text}
							</Typography>
						</Grid>
					))}

					{/* Central Graphic */}
					<Box
						position='absolute'
						top={0}
						left={0}
						right={0}
						bottom={0}
						maxWidth={'100%'}
						height={'100%'}
						display={{ xs: 'none', lg: 'block' }}
						sx={{ pointerEvents: 'none' }}
					>
						<Image
							src={'https:' + graphic.fields.file.url}
							alt={graphic.fields.title}
							layout='fill'
							objectFit='contain'
						/>
					</Box>
				</Grid>
			</Box>
		</section>
	)
}

export default Infographic
