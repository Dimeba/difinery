'use client'

import { Box, Skeleton } from '@mui/material'
import styles from './Products.module.scss'

export default function ProductsSkeleton({ count = 20 }) {
	return (
		<section className='topSection'>
			<div className='container'>
				{/* Search and Filter skeleton */}
				<Box
					width='100%'
					display='flex'
					justifyContent={{ xs: 'center', lg: 'space-between' }}
					alignItems='center'
					mb={4}
				>
					<Skeleton
						variant='rectangular'
						width={200}
						height={40}
						sx={{ display: { xs: 'none', lg: 'block' } }}
					/>
					<Skeleton variant='rectangular' width={200} height={48} />
				</Box>

				{/* Product grid skeleton */}
				<div className={styles.products}>
					{Array.from({ length: count }).map((_, index) => (
						<div key={index} className={styles.product}>
							{/* Product image skeleton with proper aspect ratio */}
							<Box
								sx={{
									aspectRatio: '1 / 1.25',
									width: '100%',
									backgroundColor: 'rgba(0, 0, 0, 0.05)'
								}}
							>
								<Skeleton
									variant='rectangular'
									width='100%'
									height='100%'
									sx={{ transform: 'none' }}
								/>
							</Box>

							{/* Product info skeleton */}
							<Box padding='1rem'>
								<Skeleton
									variant='text'
									width='80%'
									height={20}
									sx={{ mb: 0.5 }}
								/>
								<Skeleton variant='text' width='40%' height={20} />
							</Box>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
