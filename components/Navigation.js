'use client'

// components
import { Box, ClickAwayListener, Typography } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { FiShoppingBag, FiUser, FiArrowRight } from 'react-icons/fi'
import { Spin as Hamburger } from 'hamburger-react'

// hooks
import { useWindowScroll } from 'react-use'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

// context
import { useCart } from '@/context/CartContext'

const Navigation = ({ content }) => {
	const { y } = useWindowScroll()
	const isAtTop = y <= 0
	const pathName = usePathname()

	const [showSubmenu, setShowSubmenu] = useState(false)

	// cart
	const { setShowCart } = useCart()

	const isHomepage = pathName == '/' ? true : false
	const isAbout = pathName == '/our-story' ? true : false
	const isEducation = pathName == '/education' ? true : false

	return (
		<ClickAwayListener
			onClickAway={() => {
				setShowSubmenu(false)
			}}
		>
			<Box>
				<Typography variant='h6'>Navigation</Typography>
			</Box>
		</ClickAwayListener>
	)
}

export default Navigation
