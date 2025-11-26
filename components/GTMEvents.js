'use client'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { preserveGclid } from '@/lib/gaEvents'

/**
 * GTMEvents listens for route changes and dispatches a page_view event
 * so Google Tag Manager can trigger GA4 (or other) tags on SPA navigation.
 */
export default function GTMEvents() {
	const pathname = usePathname()
	const searchParams = useSearchParams()

	// Preserve GCLID on initial page load
	useEffect(() => {
		preserveGclid()
	}, [])

	useEffect(() => {
		if (typeof window === 'undefined') return
		const url =
			pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
		if (!window.dataLayer) return
		window.dataLayer.push({
			event: 'page_view',
			page_path: pathname,
			page_location: window.location.href,
			page_title: document.title,
			page_search: searchParams?.toString() || ''
		})
	}, [pathname, searchParams])

	return null
}
