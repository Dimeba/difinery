'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Skeleton } from '@mui/material'

const ProductsPlaceholder = () => {
	const router = useRouter()

	useEffect(() => {
		router.push('/shop/all/yellow-gold/all')
	}, [router])

	// Show skeleton loading while redirecting
	return (
		<main className='topSection'>
			<div className='container'>
				{/* Search and Filter skeleton */}
				<Box
					width='100%'
					display='flex'
					justifyContent={{ xs: 'center', lg: 'space-between' }}
					alignItems='center'
					mb={4}
					mt={4}
				>
					<Skeleton
						variant='rectangular'
						width={200}
						height={40}
						sx={{ display: { xs: 'none', lg: 'block' } }}
					/>
					<Skeleton variant='rectangular' width={200} height={48} />
				</Box>

				{/* Product grid skeleton - 4 rows x 2 columns */}
				<Box
					display='grid'
					gridTemplateColumns={{ xs: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
					gap={{ xs: '1rem', lg: '2rem' }}
				>
					{Array.from({ length: 8 }).map((_, index) => (
						<Box key={index}>
							{/* Product image skeleton */}
							<Skeleton
								variant='rectangular'
								width='100%'
								height={0}
								sx={{
									paddingTop: '100%', // 1:1 aspect ratio
									mb: 1
								}}
							/>
							{/* Product title skeleton */}
							<Skeleton
								variant='text'
								width='80%'
								height={20}
								sx={{ mb: 0.5 }}
							/>
							{/* Product price skeleton */}
							<Skeleton variant='text' width='40%' height={20} sx={{ mb: 1 }} />
						</Box>
					))}
				</Box>
			</div>
		</main>
	)
}

export default ProductsPlaceholder
