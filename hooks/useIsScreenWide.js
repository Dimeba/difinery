import { useState, useEffect } from 'react'

export const useIsScreenWide = widthThreshold => {
	const [isWide, setIsWide] = useState(
		typeof window !== 'undefined' && window.innerWidth > widthThreshold
	)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const handleResize = () => {
				setIsWide(window.innerWidth > widthThreshold)
			}

			window.addEventListener('resize', handleResize)

			return () => window.removeEventListener('resize', handleResize)
		}
	}, [widthThreshold])

	return isWide
}
