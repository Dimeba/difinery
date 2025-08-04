'use client'

// styles
import styles from './ProductInfo.module.scss'

// components
import Image from 'next/image'
import { Grid, Box, Typography, Button } from '@mui/material'

// hooks
import { useEffect, useState } from 'react'

// lib
import { useApolloClient } from '@apollo/client'
import { GET_PRODUCT_BY_HANDLE } from '@/lib/queries/getProductByHandle'

const CustomBox = ({ boxText, setBoxText }) => {
	const [boxProduct, setBoxProduct] = useState(null)
	const [selectedVariant, setSelectedVariant] = useState(null)

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
			setSelectedVariant(data.productByHandle.variants.edges[0].node)
		}

		fetchData()
	}, [client])

	return (
		<Grid container spacing='1rem'>
			<Grid item size={{ xs: 12, lg: 6 }} display='flex' flexDirection='column'>
				<Typography variant='p'>
					Personalize it with a special touch to create a unique and memorable
					keepsake.
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
									selectedVariant?.id === option.node.id
										? '1px solid black'
										: 'none'
							}}
							onClick={() => setSelectedVariant(option.node)}
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

				<Typography variant='p' fontStyle='italic' fontSize='10px'>
					*Additional $50
				</Typography>
			</Grid>

			<Grid
				item
				size={{ xs: 12, lg: 6 }}
				position='relative'
				// width='100%'
				sx={{ aspectRatio: '16/10' }}
			>
				<Image
					src={selectedVariant?.image.url}
					alt='Box Image'
					fill
					style={{ objectFit: 'cover' }}
				/>
			</Grid>
		</Grid>
	)
}

export default CustomBox
