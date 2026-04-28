'use client'

// styles
import styles from './ProductInfo.module.scss'

// components
import Image from 'next/image'
import { Grid, Box, Typography, Button } from '@mui/material'
import Link from 'next/link'

// hooks
import { useEffect, useState } from 'react'

// lib
import { useApolloClient } from '@apollo/client'
import { GET_PRODUCT_BY_HANDLE } from '@/lib/queries/getProductByHandle'

const CustomBox = ({ boxText, setBoxText, boxVariant, setBoxVariant }) => {
	const [boxProduct, setBoxProduct] = useState(null)
	const [showHover, setShowHover] = useState(false)

	const client = useApolloClient()

	const boxColors = [
		{ backgroundColor: '#b8a3ee', boxColor: 'Lavender' },
		{ backgroundColor: '#5d8059', boxColor: 'Green' },
		{ backgroundColor: '#bababa', boxColor: 'Light Grey' },
		{ backgroundColor: '#999999', boxColor: 'Dark Grey' }
	]

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await client.query({
				query: GET_PRODUCT_BY_HANDLE,
				variables: { handle: 'custom-box' }
			})

			setBoxProduct(data.productByHandle)
			setBoxVariant(data.productByHandle.variants.edges[0].node)
		}

		fetchData()
	}, [client, setBoxVariant])

	return (
		<Grid container spacing='1rem'>
			<Grid size={{ xs: 12, lg: 6 }} display='flex' flexDirection='column'>
				<Typography variant='p'>
					Make your packaging part of the story.
					<br />
					Each message is handwritten by a local artist.
				</Typography>

				<Typography variant='p'>Message Color:</Typography>

				<Box display='flex' gap='0.5rem' marginBottom='1rem'>
					{boxProduct?.variants.edges.map((option, index) => (
						<Button
							key={index}
							sx={{
								margin: 0,
								padding: 0,
								width: '1rem',
								minWidth: 'fit-content',
								height: '1rem',
								borderRadius: '50%',
								border: 'none',
								cursor: 'pointer',
								backgroundColor: boxColors[index].backgroundColor,
								border:
									boxVariant?.id === option.node.id ? '1px solid black' : 'none'
							}}
							onClick={() => setBoxVariant(option.node)}
						/>
					))}
				</Box>

				<Typography variant='p'>Your Message:</Typography>

				<textarea
					className={styles.boxInput}
					value={boxText}
					onChange={e => setBoxText(e.target.value)}
					placeholder='Up to 25 characters'
					maxLength={25}
				/>

				<Typography variant='p' fontSize='10px'>
					<b>Personalization: $50</b> (may extend shipping time)
					<br />
					<Typography variant='p' fontStyle='italic' fontSize='10px'>
						50% supports the artist, 50% supports women-focused causes.
					</Typography>
				</Typography>
			</Grid>

			{boxVariant && (
				<Grid
					size={{ xs: 12, lg: 6 }}
					position='relative'
					// width='100%'
					sx={{ aspectRatio: '16/10' }}
					onMouseEnter={() => setShowHover(true)}
					onMouseLeave={() => setShowHover(false)}
				>
					<Link href='/blank-canvas' aria-label='Link to Blank Canvas page'>
						<Typography
							variant='p'
							fontWeight={600}
							position='absolute'
							zIndex={2}
							bottom={0}
							left={0}
							padding='2rem'
							sx={{
								textWrap: 'balance',
								backgroundColor: 'rgba(0, 0, 0, 0.5)'
							}}
							width='100%'
							height='100%'
							color='white'
							display={showHover ? 'flex' : 'none'}
							alignItems='flex-end'
						>
							Learn more about artists and the Blank Canvas Community.
						</Typography>
						<Image
							src={boxVariant?.image.url}
							alt='Box Image'
							fill
							sizes='(max-width: 1024px) 100vw, 50vw'
							style={{ objectFit: 'cover' }}
						/>
					</Link>
				</Grid>
			)}
		</Grid>
	)
}

export default CustomBox
