'use client'

// styles
import styles from './Filters.module.scss'

// components
import Image from 'next/image'
import Accordion from './Accordion'
import { IoClose } from 'react-icons/io5'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

// analytics
import { trackFilterInteraction } from '@/lib/gaEvents'

const Filters = ({
	selectedSort,
	setSelectedSort,
	selectedCategory = 'all',
	toggleFilters,
	productType = 'all'
}) => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const sortOptions = ['Lowest Price', 'Highest Price', 'Newest']
	const metalTypes = ['Yellow Gold', 'White Gold']
	const productTypes = ['Rings', 'Earrings', 'Necklaces', 'Bracelets']
	const shapes = [
		'Marquise',
		'Round',
		'Pear',
		'Heart',
		'Radiant',
		'Oval',
		'Emerald'
	]
	const setting =
		productType === 'earrings'
			? ['Prong', '4 Prong', 'Bezel', 'Martini', 'Fishtail']
			: ['Prong', 'Bezel', 'Fishtail']
	const style =
		productType === 'rings'
			? [
					'Eternity Rings',
					'Solitaire Rings',
					'Statement Rings',
					'Stackable Rings',
					'Open Rings',
					'Everyday Diamond Rings'
			  ]
			: productType === 'earrings'
			? ['Studs', 'Hoops']
			: productType === 'necklaces'
			? ['Pendant Necklaces', 'Multi-Pendant Necklaces']
			: productType === 'bracelets'
			? ['Pendant Bracelets', 'Multi-Pendant Bracelets']
			: []

	const handleSort = sortOption => {
		setSelectedSort(sortOption)
	}

	// Extract current metal and style from pathname (e.g., /shop/rings/yellow-gold/studs)
	const pathParts = pathname.split('/')
	const currentMetalFromPath = pathParts[3] || 'yellow-gold' // default to yellow-gold
	const currentStyleFromPath = pathParts[4] || 'all' // default to 'all'

	// Get current tag filter values from URL query params
	const currentShape = searchParams.get('shape')
	const currentSetting = searchParams.get('setting')

	// Helper to update metal (changes URL path and preserves style + query params)
	const updateMetal = metalSlug => {
		const params = new URLSearchParams(searchParams)
		const queryString = params.toString()
		const newPath = `/shop/${productType}/${metalSlug}/${currentStyleFromPath}`
		router.push(`${newPath}${queryString ? `?${queryString}` : ''}`)

		// Track filter interaction
		trackFilterInteraction('metal', metalSlug)
	}

	// Helper to update style (changes URL path and preserves query params)
	const updateStyle = styleSlug => {
		const params = new URLSearchParams(searchParams)
		const queryString = params.toString()
		const newPath = `/shop/${productType}/${currentMetalFromPath}/${styleSlug}`
		router.push(`${newPath}${queryString ? `?${queryString}` : ''}`)

		// Track filter interaction
		trackFilterInteraction('style', styleSlug)
	}

	// Helper to update tag filters (only updates query params, keeps metal and style in path)
	const updateFilter = (filterType, value) => {
		const params = new URLSearchParams(searchParams)

		if (params.get(filterType) === value) {
			// If clicking the same value, remove the filter
			params.delete(filterType)
		} else {
			// Otherwise set the new value
			params.set(filterType, value)
		}

		const queryString = params.toString()
		router.push(`${pathname}${queryString ? `?${queryString}` : ''}`)

		// Track filter interaction
		trackFilterInteraction(filterType, value)
	}

	// Helper to check if a filter is active
	const isFilterActive = (filterType, value) => {
		return searchParams.get(filterType) === value
	}

	// Helper to check if style is active (from URL path)
	const isStyleActive = styleSlug => {
		return currentStyleFromPath === styleSlug
	}

	// Helper to check if any filters are active (excluding defaults)
	const hasActiveFilters = () => {
		const hasQueryFilters = currentShape || currentSetting
		const hasNonDefaultMetal = currentMetalFromPath !== 'yellow-gold'
		const hasNonDefaultStyle = currentStyleFromPath !== 'all'
		return hasQueryFilters || hasNonDefaultMetal || hasNonDefaultStyle
	}

	// Reset all filters to category default
	const resetAllFilters = () => {
		setSelectedSort(null)
		router.push(`/shop/${productType}/yellow-gold/all`)
	}

	return (
		<div className={styles.filters}>
			{/* Reset All Button */}
			{hasActiveFilters() && (
				<button className={styles.resetButton} onClick={resetAllFilters}>
					Reset All Filters
				</button>
			)}

			{/* Sort */}
			<Accordion title='Sort' state={true}>
				<div className={styles.buttons}>
					{sortOptions.map(sortOption => (
						<button
							key={sortOption}
							onClick={() => handleSort(sortOption)}
							className={`${selectedSort === sortOption ? styles.active : ''} ${
								styles.optionButton
							}`}
						>
							<p>Sort by {sortOption}</p>
						</button>
					))}
					{selectedSort && (
						<button
							className={styles.resetButton}
							onClick={() => setSelectedSort(null)}
						>
							Reset Sort
						</button>
					)}
				</div>
			</Accordion>

			{/* Product Category */}
			{productType === 'all' && productTypes.length > 2 && (
				<Accordion title='Category' state={true}>
					<div className={styles.buttons}>
						{productTypes.map(type => (
							<button
								key={type}
								onClick={() =>
									router.push(
										`/shop/${type.toLowerCase()}/${currentMetalFromPath}/all`
									)
								}
								className={`${
									selectedCategory === type.toLowerCase() ? styles.active : ''
								} ${styles.optionButton}`}
							>
								<p>{type}</p>
							</button>
						))}
					</div>
				</Accordion>
			)}

			{/* Metal */}
			<Accordion title='Metal' state={true}>
				<div className={styles.buttons}>
					{metalTypes.map(type => {
						const metalSlug = type.toLowerCase().replace(/\s+/g, '-')
						return (
							<button
								key={type}
								onClick={() => updateMetal(metalSlug)}
								className={`${
									currentMetalFromPath === metalSlug ? styles.active : ''
								} ${styles.optionButton}`}
							>
								<Image
									src={`/${type.split(' ')[0].toLowerCase()}-gold.png`}
									width={16}
									height={16}
									alt={`${type} material icon.`}
									sizes='(max-width: 768px) 100vw, 50vw'
								/>
								<p>{type}</p>
							</button>
						)
					})}
				</div>
			</Accordion>

			{/* Shape */}
			<Accordion title='Shape' state={true}>
				<div className={styles.buttons}>
					{shapes.map(shape => (
						<button
							key={shape}
							onClick={() =>
								updateFilter('shape', shape.toLowerCase().replace(/\s+/g, '-'))
							}
							className={`${
								isFilterActive(
									'shape',
									shape.toLowerCase().replace(/\s+/g, '-')
								)
									? styles.active
									: ''
							} ${styles.optionButton}`}
						>
							<p>{shape}</p>
						</button>
					))}
				</div>
			</Accordion>

			{/* Setting */}
			<Accordion title='Setting' state={true}>
				<div className={styles.buttons}>
					{setting.map(settingOption => (
						<button
							key={settingOption}
							onClick={() =>
								updateFilter(
									'setting',
									settingOption.toLowerCase().replace(/\s+/g, '-')
								)
							}
							className={`${
								isFilterActive(
									'setting',
									settingOption.toLowerCase().replace(/\s+/g, '-')
								)
									? styles.active
									: ''
							} ${styles.optionButton}`}
						>
							<p>{settingOption}</p>
						</button>
					))}
				</div>
			</Accordion>

			{/* Style */}
			{productType !== 'all' && (
				<Accordion title='Style' state={true}>
					<div className={styles.buttons}>
						{/* Add "All" option */}
						<button
							onClick={() => updateStyle('all')}
							className={`${isStyleActive('all') ? styles.active : ''} ${
								styles.optionButton
							}`}
						>
							<p>All {productType}</p>
						</button>

						{/* Style options */}
						{style.map(styleOption => {
							const styleSlug = styleOption.toLowerCase().replace(/\s+/g, '-')
							return (
								<button
									key={styleOption}
									onClick={() => updateStyle(styleSlug)}
									className={`${
										isStyleActive(styleSlug) ? styles.active : ''
									} ${styles.optionButton}`}
								>
									<p>{styleOption}</p>
								</button>
							)
						})}
					</div>
				</Accordion>
			)}

			{/* Close Button */}
			<button className={styles.closeButton} onClick={toggleFilters}>
				<p>Close</p>
				<IoClose />
			</button>
		</div>
	)
}

export default Filters
