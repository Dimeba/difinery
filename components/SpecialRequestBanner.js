'use client'

// components
import { Box, Grid, Typography } from '@mui/material'
import Image from 'next/image'
import KlaviyoForm from './KlaviyoForm'

// hooks
import { usePathname } from 'next/navigation'
import { useMediaQuery } from '@mui/material'

const SpecialRequestBanner = () => {
	const pathName = usePathname()
	const isMobile = useMediaQuery('(max-width: 1024px)')

	return (
		(pathName === '/shop/collections/engagement-rings' ||
			pathName.includes('engagement-ring')) && (
			<>
				<Grid
					container
					direction={{ xs: 'column-reverse', lg: 'row' }}
					position='relative'
					sx={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
					minHeight={{ xs: 'auto', lg: '800px' }}
					alignItems='center'
				>
					<Image
						src='/sr-banner.jpg'
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
									A Forever Piece Defined by You
								</Typography>
								<Typography variant='p' color='white'>
									Share your details to schedule a personal consultation about
									your ideal ring. Our design team will be in touch about your
									custom request.
								</Typography>
							</Box>

							{/* <SubscribeForm /> */}
							<KlaviyoForm
								fields={[
									{
										name: 'firstName',
										type: 'text',
										placeholder: 'First Name',
										required: true
									},
									{
										name: 'lastName',
										type: 'text',
										placeholder: 'Last Name',
										required: true
									},
									{
										name: 'email',
										type: 'email',
										placeholder: 'Email Address',
										required: true
									},
									{
										name: 'phoneNumber',
										type: 'phone',
										placeholder: 'Phone Number'
									}
								]}
								submitText='Start Your Custom Request'
								columns={2}
								isWhite={true}
								listName='special-requests'
								customButton={{
									text: 'Book a meeting',
									link: 'https://cal.com/difinery-admin-ef3jr7/30min?user=difinery-admin-ef3jr7&overlayCalendar=true',
									black: true
								}}
							/>
						</Box>
					</Grid>
				</Grid>
			</>
		)
	)
}

export default SpecialRequestBanner
