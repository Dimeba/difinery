import { useState, useEffect } from 'react'

export const useIsScreenWide = widthThreshold => {
	// Start with false on server to avoid hydration mismatch
	// Will be updated on client after mount
	const [isWide, setIsWide] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			// Set initial value on mount
			setIsWide(window.innerWidth > widthThreshold)
			
			const handleResize = () => {
				setIsWide(window.innerWidth > widthThreshold)
			}

			window.addEventListener('resize', handleResize)

			return () => window.removeEventListener('resize', handleResize)
		}
	}, [widthThreshold])

	return isWide
}
