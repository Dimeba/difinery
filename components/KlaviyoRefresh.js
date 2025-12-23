'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function hasKlaviyoEmbeds() {
	if (typeof document === 'undefined') return false
	return Boolean(
		document.querySelector(
			'[class*="klaviyo-form-"] , [class^="klaviyo-form-"]'
		)
	)
}

function requestKlaviyoRefresh() {
	if (typeof window === 'undefined') return

	// Klaviyo Onsite uses a command queue. In SPA navigations, embeds can appear
	// after initial load, so we ask Klaviyo to rescan the DOM.
	const refreshCommand = ['refresh']

	try {
		if (window._klOnsite && typeof window._klOnsite.push === 'function') {
			window._klOnsite.push(refreshCommand)
		}
	} catch (_) {
		// no-op
	}

	try {
		if (window.klaviyo && typeof window.klaviyo.push === 'function') {
			window.klaviyo.push(refreshCommand)
		}
	} catch (_) {
		// no-op
	}
}

export default function KlaviyoRefresh() {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const lastRefreshAtRef = useRef(0)

	useEffect(() => {
		if (!hasKlaviyoEmbeds()) return

		// Klaviyo script may still be loading; retry a few times.
		requestKlaviyoRefresh()
		const t1 = setTimeout(requestKlaviyoRefresh, 300)
		const t2 = setTimeout(requestKlaviyoRefresh, 1200)
		return () => {
			clearTimeout(t1)
			clearTimeout(t2)
		}
	}, [pathname, searchParams])

	useEffect(() => {
		if (typeof window === 'undefined' || typeof document === 'undefined') return

		const throttleMs = 500
		const observer = new MutationObserver(() => {
			if (!hasKlaviyoEmbeds()) return
			const now = Date.now()
			if (now - lastRefreshAtRef.current < throttleMs) return
			lastRefreshAtRef.current = now
			requestKlaviyoRefresh()
		})

		observer.observe(document.body, {
			childList: true,
			subtree: true
		})

		return () => observer.disconnect()
	}, [])

	return null
}
