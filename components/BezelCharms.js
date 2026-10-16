'use client'

// styles
import { Box, Grid, Typography } from '@/lib/mui'

// components
import Image from 'next/image'
import Button from './Button'

const BezelCharms = ({ onStyle }) => {
	return (
		<Grid
			container
			spacing='1rem'
			alignItems='stretch'
			sx={{ backgroundColor: '#F5F5F5' }}
		>
			<Grid
				size={{ xs: 12, lg: 6 }}
				display='flex'
				flexDirection='column'
				justifyContent='space-between'
				gap='1.5rem'
				sx={{ padding: '1.5rem' }}
			>
				<Box display='flex' flexDirection='column' gap='0.75rem'>
					<Typography variant='p' fontWeight={700}>
						The Pendant Collection
					</Typography>

					<Typography variant='p'>
						One Chain, Endless Meaning
						<br />
						Layer them, switch them, collect them over time.
						<br />
						Our new diamond pendants move between necklaces and bracelets,
						so every piece can grow with its story.
						<br />
						This season, give the first chapter.
					</Typography>
				</Box>

				<Button text='Style Your Bezel Charms' fullWidth onClick={onStyle} />
			</Grid>

			<Grid
				size={{ xs: 12, lg: 6 }}
				position='relative'
				sx={{ aspectRatio: '822 / 677' }}
			>
				<Image
					src='/bezel-charms.png'
					alt='Bezel pendant charms layered on a chain'
					fill
					sizes='(max-width: 1024px) 100vw, 40vw'
					style={{ objectFit: 'cover' }}
				/>
			</Grid>
		</Grid>
	)
}

export default BezelCharms
