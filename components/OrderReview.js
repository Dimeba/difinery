'use client'

// styles
import styles from './ProductInfo.module.scss'

// components
import { Box, Grid, Typography } from '@mui/material'
import Image from 'next/image'

// hooks
import { useState, useEffect, use } from 'react'

// context
import { useCart } from '@/context/CartContext'

// helpers
import parse from 'html-react-parser'

// lib
import { useApolloClient } from '@apollo/client'
import { GET_PRODUCT_BY_HANDLE } from '@/lib/queries/getProductByHandle'

const OrderReview = ({
	image,
	handleAddToCart,
	matchingVariant,
	product,
	customOptions
}) => {
	const { addToCart } = useCart()

	const [engravingProduct, setEngravingProduct] = useState(null)
	const [boxProduct, setBoxProduct] = useState(null)

	const client = useApolloClient()

	useEffect(() => {
		const loadOrClear = async () => {
			// ENGRAVING
			if (customOptions.engraving) {
				const { data } = await client.query({
					query: GET_PRODUCT_BY_HANDLE,
					variables: { handle: 'engraving' }
				})
				setEngravingProduct(data.productByHandle)
			} else {
				setEngravingProduct(null)
			}

			// CUSTOM BOX
			if (customOptions.boxText) {
				const { data } = await client.query({
					query: GET_PRODUCT_BY_HANDLE,
					variables: { handle: 'custom-box' }
				})
				setBoxProduct(data.productByHandle)
			} else {
				setBoxProduct(null)
			}
		}

		loadOrClear()
	}, [customOptions.engraving, customOptions.boxText])

	const addAllToCart = async () => {
		if (engravingProduct) {
			await addToCart(engravingProduct.variants.edges[0].node.id, 1, [
				{
					key: 'text',
					value: customOptions.engraving
				},
				{
					key: 'product',
					value: product.title
				}
			])
		}

		if (boxProduct) {
			await addToCart(boxProduct.variants.edges[0].node.id, 1, [
				{
					key: 'boxText',
					value: customOptions.boxText
				},
				{
					key: 'boxColor',
					value: customOptions.boxColor
				},
				{
					key: 'product',
					value: product.title
				}
			])
		}

		await handleAddToCart()
	}

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

	const basePrice = Number(matchingVariant.price.amount.slice(0, -2))
	const engravingFee = engravingProduct ? 20 : 0
	const boxFee = boxProduct ? 50 : 0
	const totalPrice = basePrice + engravingFee + boxFee

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
				<Grid
					size={{ xs: 12, md: 4 }}
					sx={{ position: 'relative' }}
					display='flex'
					flexDirection='column'
					alignItems='center'
					gap={'1rem'}
					marginBottom={{ xs: '2rem', md: '0' }}
				>
					<Typography
						variant='h2'
						align='center'
						zIndex={1}
						sx={{
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
							width: '66%',
							aspectRatio: image.width / image.height,
							position: 'relative',
							overflow: 'hidden',
							marginTop: { xs: '2rem', md: '0' }
						}}
					>
						<Image
							src={image.url}
							fill
							style={{ objectFit: 'contain', objectPosition: 'top' }}
							quality={100}
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
							${totalPrice.toLocaleString()}
						</Typography>
					</Typography>

					<button className={styles.cartButton} onClick={addAllToCart}>
						Add To Cart
					</button>
				</Grid>
			</Grid>
		</Box>
	)
}

export default OrderReview
