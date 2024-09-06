'use client'

// styles
import styles from './Filters.module.scss'

// components

// hooks
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const Filters = ({ content }) => {
	const pathName = usePathname()

	const [showFilters, setShowFilters] = useState(false)

	const handeShowFilters = () => {
		setShowFilters(!showFilters)
	}

	// Returning component if path is '/shop'
	if (pathName == '/shop') {
		return (
			<div className='container'>
				<button onClick={handeShowFilters}>Filter & Sort</button>

				{showFilters && (
					<div>
						<p>Filters</p>
					</div>
				)}
			</div>
		)
	} else {
		return null
	}
}

export default Filters
