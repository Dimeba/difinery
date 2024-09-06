'use client'

// styles
import styles from './Filters.module.scss'

// components

// hooks
import { useState } from 'react'

const Filters = ({ content }) => {
	const [showFilters, setShowFilters] = useState(false)

	const handeShowFilters = () => {
		setShowFilters(!showFilters)
	}

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
}

export default Filters
