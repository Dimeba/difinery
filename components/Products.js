'use client'

// styles
import styles from './Products.module.scss'
import productStyles from './ProductInfo.module.scss'

// components
import Image from 'next/image'
import Video from './Video'
import ProductCard from './ProductCard'
import Filters from './Filters'
import { LuSettings2 } from 'react-icons/lu'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import {
	Button,
	Box,
	TextField,
	InputAdornment,
	Typography,
	Popper
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

// hooks
import { useState, useEffect, useRef } from 'react'
import { useMediaQuery } from '@mui/material'

const EMPTY_PRODUCTS = []

const Products = ({
	title = '',
	stylizedTitle,
	showTitle = false,
	discount,
	recommendedProducts,
	showFilters = false,
	individual = false,
	products, // allow undefined; avoid new [] each render causing effect loop
	productType = '',
	collectionPreview = null,
	selectedMetalType = 'Yellow Gold',
	selectedCategory = 'all',
	selectedTag = null
}) => {
	// Stable base products list (empty singleton when undefined)
	const productsList = products ?? EMPTY_PRODUCTS

	// All products are already fetched; maintain only filtered + visible slices
	const [filteredItems, setFilteredItems] = useState(productsList)

	// Sync when incoming products prop first arrives or length changes
	useEffect(() => {
		setFilteredItems(productsList)
	}, [productsList])
	const [showFiltersMenu, setShowFiltersMenu] = useState(false)

	// filters state
	const [selectedSort, setSelectedSort] = useState(null)
	const [searchTerm, setSearchTerm] = useState('')

	const isMobile = useMediaQuery('(max-width: 1024px)')
	const anchorRef = useRef(null)

	// client-side pagination count
	const [visibleCount, setVisibleCount] = useState(16)
	const loadMore = () => {
		setVisibleCount(vc => Math.min(vc + 16, filteredItems.length))
	}

	// Filter & sort
	useEffect(() => {
		let updated = [...productsList]

		if (selectedTag) {
			const normalizedTag = selectedTag
				.split('-')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ')

			updated = updated.filter(p => p.tags?.includes(normalizedTag))
		}

		if (searchTerm) {
			const term = searchTerm.toLowerCase()
			updated = updated.filter(p => {
				const titleMatch = p.title.toLowerCase().includes(term)
				const categoryMatch = p.category?.name.toLowerCase().includes(term)
				const metalOpt = p.options?.find(o => o.name === 'Metal')
				const metalMatch = metalOpt
					? metalOpt.values.some(v => v.toLowerCase().includes(term))
					: false
				return titleMatch || categoryMatch || metalMatch
			})
		}

		if (selectedSort) {
			switch (selectedSort) {
				case 'Lowest Price':
					updated.sort(
						(a, b) =>
							+a.priceRange.minVariantPrice.amount -
							+b.priceRange.minVariantPrice.amount
					)
					break
				case 'Highest Price':
					updated.sort(
						(a, b) =>
							+b.priceRange.minVariantPrice.amount -
							+a.priceRange.minVariantPrice.amount
					)
					break
				case 'Newest':
					updated.sort(
						(a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
					)
					break
			}
		}

		setFilteredItems(updated)
	}, [
		productsList,
		selectedSort,
		selectedCategory,
		selectedMetalType,
		selectedTag,
		searchTerm
	])

	return (
		<section
			className='topSection'
			style={{ marginBottom: individual ? '0' : '' }}
		>
			<div className={`${!individual ? 'container' : ''} ${styles.content}`}>
				{showTitle && stylizedTitle && (
					<div className={`stylizedH3 ${styles.stylizedTitle}`}>
						{documentToReactComponents(stylizedTitle)}
					</div>
				)}
				{showTitle && title && !stylizedTitle && <h3>{title}</h3>}

				{/* Search and Filters toggle */}
				{showFilters && productsList.length > 0 && (
					<Box
						width='100%'
						display='flex'
						justifyContent={isMobile ? 'center' : 'space-between'}
						alignItems='center'
						mb={4}
					>
						{!isMobile && (
							<TextField
								id='standard-basic'
								variant='standard'
								placeholder='Search'
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
								sx={{ fontStyle: 'italic', fontSize: '12px' }}
								slotProps={{
									input: {
										startAdornment: (
											<InputAdornment position='start'>
												<SearchIcon fontSize='10px' />
											</InputAdornment>
										)
									}
								}}
							/>
						)}

						<Button
							onClick={() => setShowFiltersMenu(!showFiltersMenu)}
							variant='outlined'
							endIcon={<LuSettings2 size='12px' />}
							ref={anchorRef}
							sx={{
								borderRadius: 0,
								p: '0.6rem 3rem',
								color: 'black', // default text/icon color
								bgcolor: 'transparent',
								transition: 'all 0.2s ease',
								// target the SVG stroke on the icon:
								'& svg': {
									stroke: 'black',
									transition: 'stroke 0.2s ease'
								},
								'&:hover': {
									bgcolor: 'black', // hover background
									color: 'white', // hover text color
									'& svg': {
										stroke: 'white' // hover icon color
									}
								}
							}}
						>
							<Typography
								variant='p'
								fontWeight={500}
								letterSpacing={'2px'}
								color='inherit'
								fontSize={'12px'}
							>
								Sort & Filter
							</Typography>
						</Button>
					</Box>
				)}

				<div className={styles.productsContainer}>
					<div
						className={`${styles.products} ${!individual ? styles.gap : ''}`}
					>
						{collectionPreview && (
							<Box
								gridColumn={{ xs: 'span 12', lg: 'span 6' }}
								gridRow={'span 2'}
								position='relative'
								sx={{
									cursor: collectionPreview.mediaLink ? 'pointer' : 'default',
									backgroundColor: '#f7f7f7'
								}}
								onClick={() => {
									collectionPreview.mediaLink
										? (window.location.href = collectionPreview.mediaLink)
										: null
								}}
							>
								{collectionPreview.media.fields.file.contentType.includes(
									'video'
								) ? (
									<Box
										position='relative'
										height='100%'
										paddingTop={{ xs: '25%', lg: 0 }}
									>
										<Video
											style={{
												objectFit: 'contain !important',
												minHeight: '100%',
												minWidth: '100%'
											}}
											video={collectionPreview.media}
											autoPlay
										/>
									</Box>
								) : (
									<Box
										position='relative'
										minHeight={{ xs: '60vh', lg: '100%' }}
									>
										<Image
											src={'https:' + collectionPreview.media.fields.file.url}
											alt={collectionPreview.title}
											fill
											style={{ objectFit: 'cover' }}
										/>
									</Box>
								)}

								<Box
									position='absolute'
									top={0}
									width='100%'
									padding={{ xs: '2rem', lg: '4rem' }}
									paddingBottom={{ xs: '4rem', lg: '8rem' }}
									sx={{
										background:
											'linear-gradient(180deg,rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 60%, rgba(0, 0, 0, 0) 100%)'
									}}
								>
									<Typography variant='h2' textAlign='center' color='white'>
										{collectionPreview.title}
									</Typography>
									<p
										style={{
											textAlign: 'center',
											marginTop: '0.5rem',
											color: 'white'
										}}
									>
										{collectionPreview.description}
									</p>
								</Box>
							</Box>
						)}

						{!recommendedProducts &&
							filteredItems
								.filter(item => item.availableForSale)
								.slice(0, visibleCount)
								.map(product => (
									<ProductCard
										key={product.id}
										id={product.id}
										product={product}
										permalink={product.handle}
										discount={discount}
										individual={individual}
										selectedMetalType={selectedMetalType}
									/>
								))}

						{recommendedProducts &&
							recommendedProducts.length > 0 &&
							recommendedProducts.map(product => (
								<ProductCard
									key={product.id}
									id={product.id}
									product={product}
									permalink={product.handle}
									discount={discount}
									selectedMetalType={selectedMetalType}
									// individual={individual}
								/>
							))}
					</div>
				</div>
			</div>

			{/* “Load more” button: determine by filteredItems length vs visibleCount */}
			{filteredItems.length > visibleCount && (
				<Box textAlign='center' mt={4}>
					<button
						onClick={loadMore}
						className={productStyles.cartButton}
						style={{ width: 'fit-content', backgroundImage: 'none' }}
					>
						Load More
					</button>
				</Box>
			)}

			<Popper
				open={showFiltersMenu}
				placement={isMobile ? 'bottom' : 'bottom-end'}
				anchorEl={anchorRef.current}
			>
				<Filters
					selectedSort={selectedSort}
					setSelectedSort={setSelectedSort}
					selectedCategory={selectedCategory}
					selectedMetalType={selectedMetalType}
					toggleFilters={() => setShowFiltersMenu(!showFiltersMenu)}
					productType={productType}
					selectedTag={selectedTag}
				/>
			</Popper>
		</section>
	)
}

export default Products
