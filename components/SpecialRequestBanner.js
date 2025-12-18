'use client'

// components
import { Box, Grid, Typography } from '@mui/material'
import SubscribeForm from './SubscribeForm'
import Image from 'next/image'
import Link from 'next/link'

// hooks
import { usePathname } from 'next/navigation'

const SpecialRequestBanner = () => {
	const pathName = usePathname()

	return (
		pathName === '/shop/collections/engagement-rings' && (
			<>
				<Grid
					container
					direction={{ xs: 'column-reverse', lg: 'row' }}
					position='relative'
					style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
				>
					<Image
						src='/sr-banner.jpg'
						alt='Description of image'
						fill
						style={{ zIndex: -1, objectFit: 'cover' }}
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
									A Forever Piece Defined by You
								</Typography>
								<Typography variant='p' color='white'>
									Share your details to schedule a personal consultation about
									your ideal ring. Our design team will be in touch about your
									custom request.
								</Typography>
							</Box>

							{/* <SubscribeForm /> */}
							<div className='klaviyo-form-STAuUB'></div>
						</Box>
					</Grid>
				</Grid>
			</>
		)
	)
}

export default SpecialRequestBanner
