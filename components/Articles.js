// components
import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import Button from './Button'

// lib
import { getEntries } from '@/lib/contentful'

const Articles = async ({ articles }) => {
	const allArtiles = await getEntries('article')
	const articlesToRender = allArtiles.items.filter(article =>
		articles.some(a => a.sys.id === article.sys.id)
	)

	return (
		<section style={{ backgroundColor: '#E9E9E9', margin: '0' }}>
			<Box
				className='container'
				padding={{ xs: '4rem 0', lg: '6rem 0' }}
				sx={{
					display: 'grid',
					gridTemplateColumns: {
						xs: '1fr',
						md: 'repeat(2, 1fr)',
						lg: 'repeat(4, 1fr)'
					},
					gap: { xs: '1rem', md: '1rem', lg: '1rem' }
				}}
			>
				{articlesToRender.map(article => {
					const image = article.fields?.image || article.fields?.media
					const buttonText = article.fields?.readTime

					return (
						<Box
							key={article.sys.id}
							sx={{
								backgroundColor: 'white',
								display: 'flex',
								flexDirection: 'column',
								overflow: 'hidden'
							}}
						>
							{image && (
								<Box
									sx={{
										position: 'relative',
										width: '100%',
										aspectRatio: '16/10',
										backgroundColor: '#F5F5F5'
									}}
								>
									<Image
										src={
											image.fields?.file?.url
												? `https:${image.fields.file.url}`
												: image.url || image
										}
										alt={article.fields.title || 'Article image'}
										fill
										style={{ objectFit: 'cover' }}
										sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw'
									/>
								</Box>
							)}

							<Box
								sx={{
									padding: '2rem',
									display: 'flex',
									flexDirection: 'column',
									gap: '0.5rem',
									flex: 1
								}}
							>
								{article.fields.title && (
									<Typography
										variant='h3'
										textAlign={'left'}
										fontWeight={'300'}
										lineHeight={'1.2'}
									>
										{article.fields.title}
									</Typography>
								)}

								{article.fields.date && (
									<Typography
										variant='p'
										fontSize='10px'
										textTransform={'uppercase'}
									>
										{article.fields.date}
									</Typography>
								)}

								{article.fields?.shortText && (
									<Typography variant='p' mt={'0.5rem'}>
										{(() => {
											const t = article.fields.shortText ?? ''
											return t.length > 150 ? t.slice(0, 150) + '...' : t
										})()}
									</Typography>
								)}

								{buttonText && (
									<Box sx={{ marginTop: 'auto', paddingTop: '1rem' }}>
										<Button text={buttonText} link='#' /> {/* TODO: Add link */}
									</Box>
								)}
							</Box>
						</Box>
					)
				})}
			</Box>
		</section>
	)
}

export default Articles
