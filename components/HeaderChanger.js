'use client'

// hooks
import { useEffect } from 'react'

// context
import { useHeader } from '@/context/HeaderContext'

const HeaderChanger = ({ transparent }) => {
	const { setTransparentHeader } = useHeader()

	useEffect(() => {
		setTransparentHeader(transparent)
	}, [transparent])

	return null
}

export default HeaderChanger
