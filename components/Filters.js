'use client'

// styles
import styles from './Filters.module.scss'

// components
import Image from 'next/image'
import Accordion from './Accordion'
import { IoClose } from 'react-icons/io5'
import Link from 'next/link'

const Filters = ({
	selectedSort,
	setSelectedSort,
	selectedCategory = 'all',
	selectedMetalType = 'Yellow Gold',
	selectedShape,
	setSelectedShape,
	toggleFilters,
	selectedSetting,
	setSelectedSetting,
	selectedDesign,
	setSelectedDesign,
	selectedStyle,
	setSelectedStyle,
	productType = 'all'
}) => {
	const sortOptions = ['Lowest Price', 'Highest Price', 'Newest']
	const metalTypes = ['Yellow Gold', 'White Gold']
	const productTypes = ['All', 'Rings', 'Earrings', 'Necklaces', 'Bracelets']
	const shapes = [
		'All',
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
			? ['All', 'Prong', '4 Prong', 'Bezel', 'Martini', 'Fishtail']
			: ['All', 'Prong', 'Bezel', 'Fishtail']
	// const design =
	// 	productType === 'earrings'
	// 		? ['All', 'Stud', 'Hoops']
	// 		: ['All', 'Pendant', 'Station', 'Fixed']
	const style =
		productType === 'rings'
			? ['All', 'Eternity', 'Solitaire', 'Statement', 'Stackable', 'Open Rings']
			: productType === 'earrings'
			? ['All', 'Studs', 'Hoops']
			: ['All', 'Solitaire', 'Multi-Pendant']

	const handleFilter = (filter, value) => {
		if (filter === 'metalType') {
			console.log(value)
		} else if (filter === 'shape') {
			setSelectedShape(value)
		} else if (filter === 'setting') {
			setSelectedSetting(value)
		} else if (filter === 'design') {
			setSelectedDesign(value)
		} else if (filter === 'style') {
			setSelectedStyle(value)
		}
	}

	const handleSort = sortOption => {
		setSelectedSort(sortOption)
	}

	return (
		<div className={styles.filters}>
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
							<Link key={type} href={`/shop/${type.toLowerCase()}`}>
								<button
									className={`${
										selectedCategory === type.toLowerCase() ? styles.active : ''
									} ${styles.optionButton}`}
								>
									<p>{type}</p>
								</button>
							</Link>
						))}
					</div>
				</Accordion>
			)}

			{/* Metal */}
			<Accordion title='Metal' state={true}>
				<div className={styles.buttons}>
					{metalTypes.map(type => (
						<Link
							key={type}
							href={`/shop/${productType}/${type
								.replace(' ', '-')
								.toLowerCase()}`}
						>
							<button
								className={`${
									selectedMetalType === type ? styles.active : ''
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
						</Link>
					))}
				</div>
			</Accordion>

			{/* Shape */}
			<Accordion title='Shape' state={true}>
				<div className={styles.buttons}>
					{shapes.map(shape => (
						<button
							key={shape}
							onClick={() => handleFilter('shape', shape)}
							className={`${shape === selectedShape ? styles.active : ''} ${
								styles.optionButton
							}`}
						>
							<p>{shape}</p>
						</button>
					))}
				</div>
			</Accordion>

			{/* Setting */}
			<Accordion title='Setting' state={true}>
				<div className={styles.buttons}>
					{setting.map(setting => (
						<button
							key={setting}
							onClick={() => handleFilter('setting', setting)}
							className={`${setting === selectedSetting ? styles.active : ''} ${
								styles.optionButton
							}`}
						>
							<p>{setting}</p>
						</button>
					))}
				</div>
			</Accordion>

			{/* Design */}
			{/* {productType !== 'all' && productType !== 'rings' && (
				<Accordion title='Design' state={true}>
					<div className={styles.buttons}>
						{design.map(design => (
							<button
								key={design}
								onClick={() => handleFilter('design', design)}
								className={`${design === selectedDesign ? styles.active : ''} ${
									styles.optionButton
								}`}
							>
								<p>{design}</p>
							</button>
						))}
					</div>
				</Accordion>
			)} */}

			{/* Style */}
			{productType !== 'all' && (
				<Accordion title='Style' state={true}>
					<div className={styles.buttons}>
						{style.map(style => (
							<button
								key={style}
								onClick={() => handleFilter('style', style)}
								className={`${style === selectedStyle ? styles.active : ''} ${
									styles.optionButton
								}`}
							>
								<p>{style}</p>
							</button>
						))}
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
