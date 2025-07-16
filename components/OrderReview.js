'use client'

// styles
import styles from './ProductInfo.module.scss'

// components
import { Box, Grid, Typography } from '@mui/material'
import Image from 'next/image'

// helpers
import parse from 'html-react-parser'

const OrderReview = ({
	image,
	handleAddToCart,
	matchingVariant,
	product,
	customOptions
}) => {
	const additionalInfo = [
		{ icon: '/box-icon.png', text: 'Free shipping for purchases above $300' },
		{ icon: '/quality-icon.png', text: 'Excellent quality, handmade in USA' },
		{ icon: '/sustainability-icon.png', text: 'Sustainably created diamonds' },
		{ icon: '/return-icon.png', text: '30 days return' },
		{ icon: '/warranty-icon.png', text: '2 Year manufacturing warranty ' },
		{
			icon: '/polish-icon.png',
			text: '1 Year of free polish & cleaning if you subscribe.'
		}
	]

	const match = product.descriptionHtml.match(
		/<p\s+id=(['"])description\1[^>]*>[\s\S]*?<\/p>/i
	)
	const description = match ? match[0] : ''

	return (
		<Box sx={{ backgroundColor: '#f4f4f4' }} id='order-review'>
			<Grid
				container
				sx={{
					width: '1440px',
					maxWidth: '90%',
					margin: '0 auto',
					padding: '6rem 0'
				}}
				spacing={{ xs: 1, md: 6 }}
			>
				{/* Image */}
				<Grid size={{ xs: 12, md: 4 }} sx={{ position: 'relative' }}>
					<Typography
						variant='h2'
						align='center'
						zIndex={1}
						sx={{
							position: 'absolute',
							top: '0',
							width: '100%',
							textWrap: ' balance'
						}}
					>
						{product.title}
						<br />
						<Typography component='span' variant='h4' sx={{ fontWeight: 200 }}>
							for every you, forever
						</Typography>
					</Typography>
					<Box
						sx={{
							aspectRatio: '1/1',
							position: 'relative',
							overflow: 'hidden',
							marginTop: { xs: '2rem', md: '0' }
						}}
					>
						<Image
							src={image}
							fill
							alt='Image of the product.'
							sizes={'(max-width: 768px) 100vw, 50vw'}
						/>
					</Box>
				</Grid>

				{/* Description */}
				<Grid
					size={{ xs: 12, md: 4 }}
					sx={{
						aspectRatio: '1/1',
						position: 'relative',
						display: 'flex',
						flexDirection: 'column',
						gap: '2rem'
					}}
				>
					<Box>{parse(description)}</Box>

					<Box>
						{additionalInfo.map((info, index) => (
							<Box
								key={index}
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: '0.5rem',
									marginBottom: '0.5rem'
								}}
							>
								<Image src={info.icon} width={24} height={24} alt='Icon' />
								<Typography variant='p'>{info.text}</Typography>
							</Box>
						))}
					</Box>
				</Grid>

				{/* Order Summary */}
				<Grid
					size={{ xs: 12, md: 4 }}
					sx={{
						aspectRatio: '1/1',
						position: 'relative',
						display: 'flex',
						flexDirection: 'column',
						gap: '1rem',
						flex: 1
					}}
				>
					<Box>
						{/* Selected Options */}
						{matchingVariant.selectedOptions.map((option, index) => (
							<Box
								key={index}
								sx={{
									marginBottom: '0.5rem'
								}}
							>
								<Typography variant='p'>
									{option.name} / {option.value}
								</Typography>
							</Box>
						))}
						{/* Engraving */}
						{customOptions.engraving !== '' && (
							<Box
								sx={{
									marginBottom: '0.5rem'
								}}
							>
								<Typography variant='p'>
									Engraving / {customOptions.engraving}
								</Typography>
							</Box>
						)}
						{/* Box Text */}
						{customOptions.boxText !== '' && (
							<Box
								sx={{
									marginBottom: '0.5rem'
								}}
							>
								<Typography variant='p'>
									Box Text / {customOptions.boxText}
								</Typography>
							</Box>
						)}
					</Box>

					<Typography
						variant='p'
						paddingTop={'1rem'}
						borderTop={'1px solid #d6d6d6'}
					>
						With you between {new Date().toLocaleDateString()}–{' '}
						{new Date(
							Date.now() + 5 * 24 * 60 * 60 * 1000
						).toLocaleDateString()}
					</Typography>

					<Typography variant='p'>
						Price:
						<br />
						<Typography
							component='span'
							variant='p'
							sx={{ fontWeight: 500, fontSize: '1.5rem' }}
						>
							$
							{Number(
								matchingVariant.price.amount.slice(0, -2)
							).toLocaleString()}
						</Typography>
					</Typography>

					<button className={styles.cartButton} onClick={handleAddToCart}>
						Add To Cart
					</button>
				</Grid>
			</Grid>
		</Box>
	)
}

export default OrderReview
