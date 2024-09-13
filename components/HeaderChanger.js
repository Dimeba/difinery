'use client'

// context
import { useHeader } from '@/context/HeaderContext'

const HeaderChanger = ({ transparent }) => {
	const { setTransparentHeader } = useHeader()
	setTransparentHeader(transparent)

	return null
}

export default HeaderChanger
