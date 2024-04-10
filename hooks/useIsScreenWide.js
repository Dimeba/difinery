import { useState, useEffect } from 'react'

export const useIsScreenWide = widthThreshold => {
	const [isWide, setIsWide] = useState(window.innerWidth > widthThreshold)

	useEffect(() => {
		const handleResize = () => {
			setIsWide(window.innerWidth > widthThreshold)
		}

		window.addEventListener('resize', handleResize)

		return () => window.removeEventListener('resize', handleResize)
	}, [widthThreshold])

	return isWide
}
