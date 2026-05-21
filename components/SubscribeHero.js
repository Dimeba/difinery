'use client'

// styles
import styles from './SubscribeHero.module.scss'

// components
import { Box, Typography } from '@mui/material'
import KlaviyoForm from './KlaviyoForm'

// hooks
import { usePathname } from 'next/navigation'

const formFields = [
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
]

const SubscribeHero = ({ marginTop = true }) => {
	const pathName = usePathname()

	if (pathName !== '/subscribe') {
		return null
	}

	const sectionStyle = {
		marginTop: marginTop ? '' : '0',
		marginBottom: '0'
	}

	return (
		<section className={`topSection ${styles.hero}`} style={sectionStyle}>
			<div className='container'>
				<Box className={styles.content}>
					<Typography variant='h4'>Blank Canvas Community</Typography>

					<Typography
						variant='h2'
						component='h2'
						className={styles.heading}
						sx={{ fontStyle: 'normal' }}
					>
						<Box component='em' sx={{ fontStyle: 'italic' }}>
							Thank you
						</Box>{' '}
						for choosing Difinery.
					</Typography>

					<Typography variant='p' className={styles.description}>
						By scanning the code in your box, you&apos;ve unlocked something most
						people never see. Enter your details below to activate your
						membership and receive{' '}
						<Box component='strong' sx={{ fontWeight: 600 }}>
							a full year of complimentary polishing and cleaning
						</Box>{' '}
						on us.
					</Typography>

					<Box className={styles.form}>
						<KlaviyoForm
							fields={formFields}
							submitText='Activate My Membership'
							columns={2}
							listName='blank-canvas'
							solidSubmit
							centerSubmit
						/>
					</Box>
				</Box>
			</div>
		</section>
	)
}

export default SubscribeHero
