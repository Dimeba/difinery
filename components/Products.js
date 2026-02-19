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
	selectedTag = null,
	filters = null, // New prop for query parameter filters
	onLoadMore = null, // Callback to load more products from API
	canLoadMore = false, // Whether more products can be loaded
	onSearch = null, // Callback when search is performed
	isSearching = false, // Whether search is currently loading
	collectionHandle = null
}) => {
	// Stable base products list (empty singleton when undefined)
	const productsList = products ?? EMPTY_PRODUCTS

	// All products are already fetched; maintain only filtered + visible slices
	const [filteredItems, setFilteredItems] = useState(productsList)
	const [showFiltersMenu, setShowFiltersMenu] = useState(false)

	// filters state
	const [selectedSort, setSelectedSort] = useState(null)
	const [searchTerm, setSearchTerm] = useState('')

	const isMobile = useMediaQuery('(max-width: 1024px)')
	const anchorRef = useRef(null)

	// client-side pagination count
	const [visibleCount, setVisibleCount] = useState(16)

	// Sync when incoming products prop first arrives or length changes
	useEffect(() => {
		setFilteredItems(productsList)
		// If products list grew (e.g., from API load more), increase visible count
		if (productsList.length > visibleCount) {
			setVisibleCount(productsList.length)
		}
	}, [productsList, visibleCount])

	// Increase visible count when searching to show all results
	useEffect(() => {
		if (searchTerm && filteredItems.length > visibleCount) {
			setVisibleCount(filteredItems.length)
		}
	}, [searchTerm, filteredItems.length, visibleCount])

	// Notify parent when search term changes
	useEffect(() => {
		if (onSearch && searchTerm) {
			onSearch(searchTerm)
		}
	}, [onSearch, searchTerm])

	const loadMore = () => {
		// If we have a callback to load more from API, use it
		if (onLoadMore && canLoadMore) {
			onLoadMore()
		} else {
			// Otherwise, just show more of the filtered items
			setVisibleCount(vc => Math.min(vc + 16, filteredItems.length))
		}
	}

	// Filter & sort
	useEffect(() => {
		// Skip filtering while search is actively loading
		if (isSearching) {
			return
		}

		let updated = [...productsList]

		// Helper function to normalize tag strings
		const normalizeTag = tag => {
			const words = tag
				.split('-')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1))

			if (
				(tag.startsWith('multi-') || tag.startsWith('4-prong')) &&
				words.length > 1
			) {
				const [first, second, ...rest] = words
				const tail = [second, ...rest].filter(Boolean).join(' ')
				return tail ? `${first}-${tail}` : first
			}
			return words.join(' ')
		}

		// Apply filters from query parameters
		if (filters) {
			// Metal filter
			if (filters.metal) {
				const metalWords = filters.metal.split('-')
				const metalTerm = metalWords[0] // e.g., "yellow" from "yellow-gold"
				updated = updated.filter(p =>
					p.options?.some(opt =>
						opt.values.some(value => value.toLowerCase().includes(metalTerm))
					)
				)
			}

			// Shape filter
			if (filters.shape) {
				const normalizedShape = normalizeTag(filters.shape)
				updated = updated.filter(p => p.tags?.includes(normalizedShape))
			}

			// Setting filter
			if (filters.setting) {
				const normalizedSetting = normalizeTag(filters.setting)
				updated = updated.filter(p => p.tags?.includes(normalizedSetting))
			}

			// Style filter
			if (filters.style) {
				const normalizedStyle = normalizeTag(filters.style)
				updated = updated.filter(p => p.tags?.includes(normalizedStyle))
			}
		}

		// Legacy support for old props (if still used elsewhere)
		if (selectedMetalType && !filters) {
			updated = updated.filter(p =>
				p.options?.some(opt =>
					opt.values.some(value =>
						value
							.toLowerCase()
							.includes(selectedMetalType.split(' ')[0].toLowerCase())
					)
				)
			)
		}

		if (selectedTag && !filters) {
			const normalizedTag = normalizeTag(selectedTag)
			updated = updated.filter(p => p.tags?.includes(normalizedTag))
		}

		// Search filter
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

		// Sort
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
		searchTerm,
		filters,
		isSearching
	])

	// Build list name for ProductCard
	const getListName = () => {
		let listName = 'Shop'
		if (filters?.category && filters.category !== 'all') {
			listName = `Category: ${filters.category}`
		}
		if (filters?.metal) {
			listName += ` - ${filters.metal}`
		}
		if (filters?.style && filters.style !== 'all') {
			listName += ` - ${filters.style}`
		}
		if (searchTerm) {
			listName = `Search: ${searchTerm}`
		}
		return listName
	}

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
						{collectionPreview?.media && (
							<Box
								gridColumn={{ xs: 'span 12', lg: 'span 6' }}
								gridRow={'span 2'}
								position='relative'
								overflow='hidden'
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
									<Box position='relative' height='100%' width='100%'>
										<Video
											style={{
												objectFit: 'cover',
												width: '100%',
												height: '100%',
												display: 'block'
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
								.map((product, index) => (
									<ProductCard
										key={product.id}
										id={product.id}
										product={product}
										permalink={product.handle}
										discount={discount}
										individual={individual}
										selectedMetalType={selectedMetalType}
										index={index}
										listName={getListName()}
										collectionHandle={collectionHandle}
									/>
								))}

						{recommendedProducts &&
							recommendedProducts.length > 0 &&
							recommendedProducts.map((product, index) => (
								<ProductCard
									key={product.id}
									id={product.id}
									product={product}
									permalink={product.handle}
									discount={discount}
									selectedMetalType={selectedMetalType}
									index={index}
									listName='Recommended Products'
									collectionHandle={collectionHandle}
									// individual={individual}
								/>
							))}
					</div>
				</div>
			</div>

			{/* "Load more" button: show if more filtered items to display OR if can load more from API, but hide when searching */}
			{!searchTerm && (filteredItems.length > visibleCount || canLoadMore) && (
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
					toggleFilters={() => setShowFiltersMenu(!showFiltersMenu)}
					productType={productType}
				/>
			</Popper>
		</section>
	)
}

export default Products
