'use client'

// components
import { Box, Grid, Typography } from '@mui/material'
import SubscribeForm from './SubscribeForm'
import Image from 'next/image'
import Link from 'next/link'

// hooks
import { usePathname } from 'next/navigation'
import { useMediaQuery } from '@mui/material'

const SubscribeSection = () => {
	const pathName = usePathname()
	const isMobile = useMediaQuery('(max-width: 1024px)')

	return (
		(pathName === '/' ||
			pathName === '/our-story' ||
			pathName === '/education') && (
			<>
				<Grid
					container
					direction={{ xs: 'column-reverse', lg: 'row' }}
					position='relative'
					style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
				>
					<Image
						src='/sub-banner.jpg'
						alt='Description of image'
						fill
						style={{
							zIndex: -1,
							objectFit: 'cover',
							objectPosition: isMobile ? 'left' : 'center'
						}}
						quality={100}
					/>

					{/* Form */}
					<Grid
						size={{ xs: 12, lg: 6 }}
						padding={{ xs: '4rem 0', lg: '8rem 0' }}
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
								<Typography variant='h2' color='white'>
									Join Our Blank Canvas Community
								</Typography>
								<Typography variant='p' color='white'>
									Stay in touch and become a part of the creative journey. We
									respect your inbox. No spam. No discount games. Just timeless
									jewelry with meaningful updates.
								</Typography>
							</Box>

							{/* <SubscribeForm /> */}
							<div className='klaviyo-form-RmsYWx'></div>

							<Link href='/blank-canvas'>
								<Typography
									variant='p'
									fontSize={10}
									color='white'
									style={{ textDecoration: 'underline' }}
								>
									Learn more about our Blank Canvas Community
								</Typography>
							</Link>
						</Box>
					</Grid>

					{/* Image */}
					{/* <Grid
                size={{ xs: 12, lg: 6 }}
                position='relative'
                padding={{ xs: '4rem 0', lg: '6rem 0' }}
				display='flex'
				justifyContent={{ xs: 'center', lg: 'flex-start' }}
                alignItems={ 'center' }
            >
				<Image
					src='/subscribe-image.png'
					alt='Description of image'
					fill
                    style={{ zIndex: -1, objectFit: 'cover' }}
				/>

				<Box height="100%" width="100%" position='absolute' sx={{backgroundColor: 'rgba(0,0,0,0.25)'}}></Box>

                <Box
					zIndex={2}
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
                                style={{ marginTop: '7px' }}
                            />
                            <Typography variant='p' fontFamily={'Newsreader'} fontSize={"18px"}  sx={{textWrap: 'balance'}} color='white'>{bullet}</Typography>
                        </Box>
                    ))}
                </Box>
			</Grid> */}
				</Grid>
			</>
		)
	)
}

export default SubscribeSection
