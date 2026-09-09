'use client'

import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react'

import { useAuth } from './AuthContext'

// Mirrors the CART_STORAGE_KEY convention in CartContext.
const WISHLIST_STORAGE_KEY = 'difinery_wishlist'

const WishlistContext = createContext({
	ids: [],
	has: () => false,
	toggle: async () => {},
	loading: true,
	count: 0
})

function readLocal() {
	try {
		const raw = localStorage.getItem(WISHLIST_STORAGE_KEY)
		const parsed = raw ? JSON.parse(raw) : []
		return Array.isArray(parsed) ? parsed.filter(id => typeof id === 'string') : []
	} catch {
		return []
	}
}

function writeLocal(ids) {
	try {
		localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids))
	} catch (error) {
		console.error('Error saving wishlist to localStorage:', error)
	}
}

export const WishlistProvider = ({ children }) => {
	const { isLoggedIn, loading: authLoading } = useAuth()
	const [ids, setIds] = useState([])
	const [loading, setLoading] = useState(true)
	const hasMergedRef = useRef(false)

	// Guests read straight from localStorage; signed-in customers read the
	// custom.wishlist metafield, folding in anything saved while signed out.
	useEffect(() => {
		if (authLoading) return

		let cancelled = false

		const load = async () => {
			if (!isLoggedIn) {
				setIds(readLocal())
				setLoading(false)
				return
			}

			const pending = readLocal()

			try {
				if (pending.length && !hasMergedRef.current) {
					hasMergedRef.current = true
					const res = await fetch('/api/account/wishlist', {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						credentials: 'include',
						body: JSON.stringify({ ids: pending, merge: true })
					})
					const data = await res.json()
					if (!cancelled && res.ok) {
						setIds(data.ids || [])
						writeLocal([])
					}
				} else {
					const res = await fetch('/api/account/wishlist', {
						credentials: 'include',
						cache: 'no-store'
					})
					const data = await res.json()
					if (!cancelled) setIds(data.ids || [])
				}
			} catch (error) {
				console.error('Error loading wishlist:', error)
				if (!cancelled) setIds(pending)
			} finally {
				if (!cancelled) setLoading(false)
			}
		}

		load()
		return () => {
			cancelled = true
		}
	}, [isLoggedIn, authLoading])

	const has = useCallback(productId => ids.includes(productId), [ids])

	const toggle = useCallback(
		async productId => {
			if (!productId) return

			const next = ids.includes(productId)
				? ids.filter(id => id !== productId)
				: [...ids, productId]

			// Optimistic — the heart flips immediately, then we persist.
			setIds(next)

			if (!isLoggedIn) {
				writeLocal(next)
				return
			}

			try {
				const res = await fetch('/api/account/wishlist', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify({ ids: next })
				})
				if (!res.ok) throw new Error(`Request failed: ${res.status}`)
				const data = await res.json()
				setIds(data.ids || next)
			} catch (error) {
				console.error('Error saving wishlist:', error)
				setIds(ids) // roll back
			}
		},
		[ids, isLoggedIn]
	)

	return (
		<WishlistContext.Provider
			value={{ ids, has, toggle, loading, count: ids.length }}
		>
			{children}
		</WishlistContext.Provider>
	)
}

export const useWishlist = () => useContext(WishlistContext)
