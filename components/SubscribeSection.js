'use client'

// components
import { Box, Grid, Typography } from '@mui/material'
import KlaviyoForm from './KlaviyoForm'
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
							<KlaviyoForm
								fields={[
									{
										name: 'fullName',
										type: 'text',
										placeholder: 'Full Name',
										required: true
									},
									{
										name: 'email',
										type: 'email',
										placeholder: 'Email Address',
										required: true
									},
									{
										name: 'dateOfBirth',
										type: 'text',
										placeholder: 'Date of Birth'
									},
									{
										name: 'phoneNumber',
										type: 'phone',
										placeholder: 'Phone Number'
									}
								]}
								submitText='Subscribe'
								columns={2}
								isWhite={true}
								listName='blank-canvas'
							/>

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
				</Grid>
			</>
		)
	)
}

export default SubscribeSection
