'use client'

import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState
} from 'react'

// Non-httpOnly flag cookie written alongside the session by
// lib/customerAccount/tokens.js. It carries no secret — it only lets the
// header paint the signed-in state instantly on statically served pages.
const AUTH_FLAG_COOKIE = 'dfn_auth'

const AuthContext = createContext({
	isLoggedIn: false,
	customer: null,
	loading: true,
	refresh: async () => {},
	loginHref: () => '/api/account/login'
})

function readAuthFlag() {
	if (typeof document === 'undefined') return false
	return document.cookie
		.split('; ')
		.some(entry => entry === `${AUTH_FLAG_COOKIE}=1`)
}

export const AuthProvider = ({ children }) => {
	// Starts false so server and client markup match; the effect below settles
	// the real value on mount.
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [customer, setCustomer] = useState(null)
	const [loading, setLoading] = useState(true)

	const refresh = useCallback(async () => {
		if (!readAuthFlag()) {
			setIsLoggedIn(false)
			setCustomer(null)
			setLoading(false)
			return
		}

		// Optimistic: the flag is enough to render the account icon correctly
		// while the details request is in flight.
		setIsLoggedIn(true)

		try {
			const res = await fetch('/api/account/me', {
				credentials: 'include',
				cache: 'no-store'
			})
			const data = await res.json()
			setIsLoggedIn(Boolean(data.loggedIn))
			setCustomer(data.customer || null)
		} catch (error) {
			// Network hiccup — keep the optimistic state rather than flapping
			// the UI to signed out.
			console.error('Failed to load customer session:', error)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		refresh()
	}, [refresh])

	const loginHref = useCallback(
		returnTo =>
			returnTo
				? `/api/account/login?returnTo=${encodeURIComponent(returnTo)}`
				: '/api/account/login',
		[]
	)

	return (
		<AuthContext.Provider
			value={{ isLoggedIn, customer, loading, refresh, loginHref }}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
