// components
import { Box, Grid, Typography } from '@mui/material'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

// lib
import { getEntriesByIds } from '@/lib/contentful'

const Timeline = async ({ title, stylizedTitle, features }) => {
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

				{/* Timeline Content */}
				<Box
					display='flex'
					flexDirection={{ xs: 'column', lg: 'row' }}
					gap={{ xs: '4rem', lg: 0 }}
				>
					{content.map((feature, index) => (
						<Box
							key={feature.sys.id}
							flex={1}
							display={'flex'}
							flexDirection='column'
							gap={'2rem'}
							alignItems='center'
						>
							<Box
								position='relative'
								width={'100%'}
								borderBottom={'1px solid black'}
								paddingBottom={'1rem'}
							>
								<Box
									position='absolute'
									bottom={'-8px'}
									left={'50%'}
									width={'16px'}
									height={'16px'}
									sx={{
										backgroundColor: 'white',
										borderRadius: '50%',
										transform: 'translateX(-50%)'
									}}
									border={'1px solid black'}
								/>

								<Typography variant='h2' textAlign='center' width={'100%'}>
									{index + 1}
								</Typography>
							</Box>

							<Typography
								variant='h4'
								textAlign='center'
								padding={'0 2rem'}
								lineHeight={1.5}
							>
								{feature.fields.number}
							</Typography>

							<Typography variant='body2' textAlign='center' padding={'0 2rem'}>
								{feature.fields.text}
							</Typography>
						</Box>
					))}
				</Box>
			</Box>
		</section>
	)
}

export default Timeline
