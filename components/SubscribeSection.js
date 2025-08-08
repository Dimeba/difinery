'use client'

// components
import { Box, Grid, Typography } from '@mui/material'
import SubscribeForm from './SubscribeForm'
import Image from 'next/image'

// hooks
import { usePathname } from 'next/navigation'

// data
import subscribeBullets from '@/data/subscribeBullets.json' with { type: 'json' }

const SubscribeSection = () => {
    const pathName = usePathname()

	return (
		(pathName === '/' || pathName === '/our-story' || pathName === '/education') && <><Grid container direction={{ xs: 'column-reverse', lg: 'row'}}>
			{/* Form */}
			<Grid
				size={{ xs: 12, lg: 6 }}
				padding={{ xs: '4rem 0', lg: '6rem 0' }}
				display='flex'
				justifyContent={{ xs: 'center', lg: 'flex-end' }}
			>
				<Box
					maxWidth={1440 / 2}
					width={{ xs: '90vw', lg: '45vw' }}
					paddingRight={{ xs: 0, lg: '4rem' }}
					display='flex'
					flexDirection='column'
					gap='1rem'
				>
					<Box display='flex' flexDirection='column' gap='0.5rem'>
						<Typography variant='h2'>Join Difinery Circle.</Typography>
						<Typography variant='p'>
							Stay in touch, share beautiful things first, and invite you into
							the creative journey. We respect your inbox. No spam. No discount
							games. Just timeless jewelry with a clear conscience and
							meaningful updates you'll want to open.
						</Typography>
					</Box>

					<SubscribeForm />
				</Box>
			</Grid>

			{/* Image */}
			<Grid
                size={{ xs: 12, lg: 6 }}
                position='relative'
                padding={{ xs: '4rem 0', lg: '6rem 0' }}
				display='flex'
				justifyContent={{ xs: 'center', lg: 'flex-start' }}
                alignItems={ 'center' }
            >
				<Image
					src='/subscribe-image.jpg'
					alt='Description of image'
					fill
                    style={{ zIndex: -1, objectFit: 'cover' }}
				/>

                <Box
                    maxWidth={1440 / 2}
					width={{ xs: '90vw', lg: '45vw' }}
					paddingLeft={{ xs: 0, lg: '4rem' }}
					display='flex'
					flexDirection='column'
					gap='1rem'>
                    {subscribeBullets.map((bullet, index) => (
                        <Box key={index} display='flex' gap='0.5rem'>
                            <Image
                                src='/custom-bullet.svg'
                                alt='Bullet point icon'
                                width={12}
                                height={12}
                                style={{ marginTop: '5px' }}
                            />
                            <Typography variant='p'  sx={{textWrap: 'balance'}} color='white'>{bullet}</Typography>
                        </Box>
                    ))}
                </Box>
			</Grid>
		</Grid></>
    )
	
}

export default SubscribeSection
