'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { FiHeart } from 'react-icons/fi'

import { useWishlist } from '@/context/WishlistContext'
import styles from './WishlistButton.module.scss'

/**
 * Saves a product to the wishlist.
 *
 * Guests are stored in localStorage and merged into the customer's
 * custom.wishlist metafield the first time they sign in, so the button works
 * signed out — no login wall on the product page.
 *
 * @param {string} productId  Shopify product GID
 * @param {'icon'|'text'} variant
 * @param {boolean} refreshOnChange  re-render the server page after a change
 */
const WishlistButton = ({
	productId,
	variant = 'icon',
	refreshOnChange = false,
	className = ''
}) => {
	const { has, toggle } = useWishlist()
	const router = useRouter()
	const [isMounted, setIsMounted] = useState(false)
	const [isPending, startTransition] = useTransition()

	useEffect(() => {
		setIsMounted(true)
	}, [])

	// Saved state only exists client side; the pages are statically rendered.
	const saved = isMounted && has(productId)

	const onClick = async () => {
		await toggle(productId)
		if (refreshOnChange) startTransition(() => router.refresh())
	}

	if (!productId) return null

	if (variant === 'text') {
		return (
			<button
				type='button'
				onClick={onClick}
				disabled={isPending}
				className={`${styles.textButton} ${className}`}
				suppressHydrationWarning
			>
				{saved ? 'Remove' : 'Save'}
			</button>
		)
	}

	return (
		<button
			type='button'
			onClick={onClick}
			disabled={isPending}
			aria-pressed={saved}
			aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
			className={`${styles.iconButton} ${saved ? styles.saved : ''} ${className}`}
			suppressHydrationWarning
		>
			<FiHeart
				size='1.1rem'
				strokeWidth={1.25}
				fill={saved ? 'currentColor' : 'none'}
				suppressHydrationWarning
			/>
		</button>
	)
}

export default WishlistButton
