'use client'

import { usePathname } from 'next/navigation'

// Routes rendered without the global header and footer, e.g. the in-store
// iPad kiosk, where visitors should not be able to navigate away.
const CHROMELESS_ROUTES = ['/ubs-raffle']

const SiteChrome = ({ children }) => {
	const pathname = usePathname()?.replace(/\/$/, '')

	if (CHROMELESS_ROUTES.includes(pathname)) return null

	return children
}

export default SiteChrome
