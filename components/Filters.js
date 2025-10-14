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
	toggleFilters,
	productType = 'all',
	selectedTag = 'all'
}) => {
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
								.replace(/\s+/g, '-')
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
						<Link
							key={shape}
							href={`/shop/${productType}/${selectedMetalType
								.replace(/\s+/g, '-')
								.toLowerCase()}/${shape.replace(/\s+/g, '-').toLowerCase()}`}
						>
							<button
								className={`${
									shape.toLowerCase() === selectedTag ? styles.active : ''
								} ${styles.optionButton}`}
							>
								<p>{shape}</p>
							</button>
						</Link>
					))}
				</div>
			</Accordion>

			{/* Setting */}
			<Accordion title='Setting' state={true}>
				<div className={styles.buttons}>
					{setting.map(setting => (
						<Link
							key={setting}
							href={`/shop/${productType}/${selectedMetalType
								.replace(/\s+/g, '-')
								.toLowerCase()}/${setting.replace(/\s+/g, '-').toLowerCase()}`}
						>
							<button
								className={`${
									setting.toLowerCase() === selectedTag ? styles.active : ''
								} ${styles.optionButton}`}
							>
								<p>{setting}</p>
							</button>
						</Link>
					))}
				</div>
			</Accordion>

			{/* Style */}
			{productType !== 'all' && (
				<Accordion title='Style' state={true}>
					<div className={styles.buttons}>
						{style.map(style => (
							<Link
								key={style}
								href={`/shop/${productType}/${selectedMetalType
									.replace(/\s+/g, '-')
									.toLowerCase()}/${style.replace(/\s+/g, '-').toLowerCase()}`}
							>
								<button
									className={`${
										style.toLowerCase() === selectedTag ? styles.active : ''
									} ${styles.optionButton}`}
								>
									<p>{style}</p>
								</button>
							</Link>
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
