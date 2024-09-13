'use client'

// hooks
import { createContext, useContext, useState, useEffect } from 'react'

const HeaderContext = createContext()

export const HeaderProvider = ({ children }) => {
	const [transparentHeader, setTransparentHeader] = useState(false)

	return (
		<HeaderContext.Provider value={{ transparentHeader, setTransparentHeader }}>
			{children}
		</HeaderContext.Provider>
	)
}

export const useHeader = () => useContext(HeaderContext)
