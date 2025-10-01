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
	}, [client])

	return (
		<Grid container spacing='1rem'>
			<Grid size={{ xs: 12, lg: 6 }} display='flex' flexDirection='column'>
				<Typography variant='p'>
					<Link href='/blank-canvas' aria-label='Link to Blank Canvas page'>
						<Typography
							variant='p'
							sx={{ textDecoration: 'underline' }}
							fontWeight={600}
						>
							Learn More About Our Blank Canvas Community
						</Typography>
					</Link>
					<br />
					Complete with a handwritten message from a local artist.
				</Typography>

				<Typography variant='p'>Message Color:</Typography>

				<Box display='flex' gap='0.5rem'>
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

				<textarea
					className={styles.boxInput}
					value={boxText}
					onChange={e => setBoxText(e.target.value)}
					placeholder='Type up to 25 characters'
					maxLength={25}
				/>

				<Typography variant='p' fontSize='10px'>
					An additional $50 price. May affect shipping time.
					<br />
					<Typography variant='p' fontStyle='italic' fontSize='10px'>
						50% of proceeds to the artist, 50% of proceeds to charity
					</Typography>
				</Typography>
			</Grid>

			{boxVariant && (
				<Grid
					size={{ xs: 12, lg: 6 }}
					position='relative'
					// width='100%'
					sx={{ aspectRatio: '16/10' }}
				>
					<Image
						src={boxVariant?.image.url}
						alt='Box Image'
						fill
						style={{ objectFit: 'cover' }}
					/>
				</Grid>
			)}
		</Grid>
	)
}

export default CustomBox
