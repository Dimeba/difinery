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
						Style Your Charm Necklace
					</Typography>

					<Typography variant='p'>
						Start with a chain in yellow or white gold and add up to five
						diamond charms. Choose each lab grown diamond by shape, from round
						and pear to heart and emerald. Each charm holds a 0.20 ct diamond
						in a bezel setting and moves between necklaces and bracelets. Wear
						one every day, or add more for birthdays, anniversaries and the
						moments you want to keep close. One chain, endless meaning.
					</Typography>
				</Box>

				<Button text='Build Your Charm Necklace' fullWidth onClick={onStyle} />
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
