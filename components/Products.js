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
import { useSearchParams } from 'next/navigation'

// lib
import { GET_PRODUCTS } from '@/lib/queries/getProducts'
import { GET_COLLECTION_BY_HANDLE } from '@/lib/queries/getCollectionByHandle'
import { useApolloClient } from '@apollo/client'

const Products = ({
	title = '',
	stylizedTitle,
	showTitle = false,
	discount,
	recommendedProducts,
	showFilters = false,
	individual = false,
	products = [],
	initialPageInfo = {},
	productType = '',
	collectionPreview = null
}) => {
	const params = useSearchParams()
	const type = params.get('type')
	const shape = params.get('shape')
	const setting = params.get('setting')
	const design = params.get('design')
	const style = params.get('style')

	const [items, setItems] = useState(products)
	const [pageInfo, setPageInfo] = useState(initialPageInfo)
	const [filteredItems, setFilteredItems] = useState(products)
	const [showFiltersMenu, setShowFiltersMenu] = useState(false)

	// filters state
	const [selectedSort, setSelectedSort] = useState(null)
	const [selectedCategory, setSelectedCategory] = useState(type ? type : 'All')
	const [selectedMetalType, setSelectedMetalType] = useState('Yellow')
	const [selectedShape, setSelectedShape] = useState(shape ? shape : 'All')
	const [selectedSetting, setSelectedSetting] = useState(
		setting ? setting : 'All'
	)
	const [selectedDesign, setSelectedDesign] = useState(design ? design : 'All')
	const [selectedStyle, setSelectedStyle] = useState(style ? style : 'All')
	const [searchTerm, setSearchTerm] = useState('')

	const client = useApolloClient()
	const isMobile = useMediaQuery('(max-width: 1024px)')
	const anchorRef = useRef(null)

	const loadMore = async () => {
		if (!pageInfo.hasNextPage) return
		const { data } = await client.query({
			query: productType === 'all' ? GET_PRODUCTS : GET_COLLECTION_BY_HANDLE,
			variables:
				productType === 'all'
					? { first: 16, after: pageInfo.endCursor }
					: { handle: productType, first: 16, after: pageInfo.endCursor }
		})

		const newEdges =
			productType === 'all'
				? data.products.edges
				: data.collectionByHandle.products.edges
		setItems(prev => [...prev, ...newEdges.map(edge => edge.node)])
		setPageInfo(
			productType === 'all'
				? data.products.pageInfo
				: data.collectionByHandle.products.pageInfo
		)
	}

	// Filter & sort
	useEffect(() => {
		let updated = [...items]

		if (selectedCategory !== 'All') {
			updated = updated.filter(p => p.category.name === selectedCategory)
		}

		// if (selectedMetalType) {
		// 	updated = updated.filter(p =>
		// 		p.options?.some(opt =>
		// 			opt.values.some(value =>
		// 				value.toLowerCase().includes(selectedMetalType.toLowerCase())
		// 			)
		// 		)
		// 	)
		// }

		if (selectedShape !== 'All') {
			updated = updated.filter(p => p.tags?.includes(selectedShape))
		}

		if (selectedSetting !== 'All') {
			updated = updated.filter(p => p.tags?.includes(selectedSetting))
		}

		if (selectedDesign !== 'All') {
			updated = updated.filter(p => p.tags?.includes(selectedDesign))
		}

		if (selectedStyle !== 'All') {
			const normalizedStyle = selectedStyle.replace(/-/g, ' ')
			updated = updated.filter(p => p.tags?.includes(normalizedStyle))
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
		items,
		selectedSort,
		selectedCategory,
		selectedMetalType,
		selectedShape,
		selectedSetting,
		selectedDesign,
		selectedStyle,
		searchTerm
	])

	useEffect(() => {
		setSelectedCategory(type ?? 'All')
		setSelectedShape(shape ?? 'All')
		setSelectedSetting(setting ?? 'All')
		setSelectedDesign(design ?? 'All')
		setSelectedStyle(style ?? 'All')
	}, [type, shape, setting, design, style])

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
				{showFilters && items.length > 0 && (
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
							>
								{collectionPreview.media.fields.file.contentType.includes(
									'video'
								) ? (
									<Box position='relative' height='100%'>
										<Video
											style={{
												objectFit: 'cover !important',
												minHeight: '100%',
												minWidth: '100%'
											}}
											video={collectionPreview.media}
											autoPlay
										/>
									</Box>
								) : (
									<Image
										src={'https:' + collectionPreview.media.fields.file.url}
										alt={collectionPreview.title}
										fill
										style={{ objectFit: 'cover' }}
									/>
								)}

								<Box
									position='absolute'
									top={0}
									width='100%'
									padding={{ xs: '2rem', lg: '4rem' }}
									paddingBottom={{ xs: '4rem', lg: '8rem' }}
									sx={{
										background:
											'linear-gradient(180deg,rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0) 100%)'
									}}
								>
									<Typography
										variant='h2'
										textAlign={{ xs: 'center', lg: 'left' }}
										color='white'
									>
										{collectionPreview.title}
									</Typography>
									<Typography
										variant='h4'
										textAlign={{ xs: 'center', lg: 'left' }}
										color='white'
									>
										Collection
									</Typography>
								</Box>
							</Box>
						)}

						{!recommendedProducts &&
							filteredItems
								.filter(item => item.availableForSale)
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

			{/* “Load more” button */}
			{pageInfo.hasNextPage && (
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
					items={items}
					selectedSort={selectedSort}
					setSelectedSort={setSelectedSort}
					selectedCategory={selectedCategory}
					setSelectedCategory={setSelectedCategory}
					selectedMetalType={selectedMetalType}
					setSelectedMetalType={setSelectedMetalType}
					selectedShape={selectedShape}
					setSelectedShape={setSelectedShape}
					selectedSetting={selectedSetting}
					setSelectedSetting={setSelectedSetting}
					selectedDesign={selectedDesign}
					setSelectedDesign={setSelectedDesign}
					selectedStyle={selectedStyle}
					setSelectedStyle={setSelectedStyle}
					toggleFilters={() => setShowFiltersMenu(!showFiltersMenu)}
					productType={productType}
				/>
			</Popper>
		</section>
	)
}

export default Products
