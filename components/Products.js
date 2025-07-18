'use client'

// styles
import styles from './Products.module.scss'
import productStyles from './ProductInfo.module.scss'

// components
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
	productType = ''
}) => {
	const [items, setItems] = useState(products)
	const [pageInfo, setPageInfo] = useState(initialPageInfo)
	const [filteredItems, setFilteredItems] = useState(products)
	const [showFiltersMenu, setShowFiltersMenu] = useState(false)

	// filters state
	const [selectedSort, setSelectedSort] = useState(null)
	const [selectedCategory, setSelectedCategory] = useState('All')
	const [selectedMetalTypes, setSelectedMetalTypes] = useState([])
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

		if (selectedMetalTypes.length) {
			updated = updated.filter(p =>
				p.options?.some(opt =>
					opt.values.some(value =>
						selectedMetalTypes.some(mt =>
							value.toLowerCase().includes(mt.toLowerCase())
						)
					)
				)
			)
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
	}, [items, selectedSort, selectedCategory, selectedMetalTypes, searchTerm])

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
									individual={individual}
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
					selectedMetalTypes={selectedMetalTypes}
					setSelectedMetalTypes={setSelectedMetalTypes}
					toggleFilters={() => setShowFiltersMenu(!showFiltersMenu)}
				/>
			</Popper>
		</section>
	)
}

export default Products
