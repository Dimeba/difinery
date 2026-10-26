'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

// next/link prefetches every link as soon as it scrolls into view. On a phone
// that means a page full of links downloads several other pages while it is
// still loading itself. This link prefetches on intent instead: hover, touch
// or keyboard focus, which still lands before the click in practice.
const toHref = href => {
	if (typeof href === 'string') return href
	const search = href.query ? `?${new URLSearchParams(href.query)}` : ''
	return `${href.pathname}${search}`
}

const IntentLink = ({ href, onMouseEnter, onTouchStart, onFocus, ...props }) => {
	const router = useRouter()

	const prefetch = handler => event => {
		const target = toHref(href)
		// External links and in-page anchors have nothing to prefetch.
		if (target.startsWith('/')) router.prefetch(target)
		handler?.(event)
	}

	return (
		<Link
			href={href}
			prefetch={false}
			onMouseEnter={prefetch(onMouseEnter)}
			onTouchStart={prefetch(onTouchStart)}
			onFocus={prefetch(onFocus)}
			{...props}
		/>
	)
}

export default IntentLink
