import { Skeleton, Box } from '@mui/material'
import styles from './ProductInfo.module.scss'

const ProductInfoSkeleton = () => {
	return (
		<section className='topSection'>
			<div className={styles.productInfo}>
				{/* Images column */}
				<div className={styles.images}>
					{[1, 2, 3].map(i => (
						<Box
							key={i}
							className={styles.image}
							sx={{
								backgroundColor: `rgba(0, 0, 0, ${(
									0.03 +
									((i - 1) / 2) * 0.05
								).toFixed(2)})`
							}}
						>
							<Skeleton
								variant='rectangular'
								width='100%'
								height='100%'
								sx={{ position: 'absolute', top: 0, left: 0 }}
							/>
						</Box>
					))}
				</div>

				{/* Content column */}
				<div className={styles.content}>
					<Skeleton variant='text' width='60%' height={40} />
					<Skeleton variant='text' width='30%' height={30} />
					<Skeleton variant='rectangular' width='100%' height={150} />
					<Skeleton variant='rectangular' width='100%' height={60} />
				</div>
			</div>
		</section>
	)
}

export default ProductInfoSkeleton
