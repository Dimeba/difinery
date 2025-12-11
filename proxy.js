// proxy.js
import { NextResponse } from 'next/server'

const ALLOWED_CATEGORIES = [
	'bracelets',
	'earrings',
	'rings',
	'necklaces',
	'all'
]

const ALLOWED_METALS = ['yellow-gold', 'white-gold', 'rose-gold']

export function proxy(request) {
	const { pathname } = request.nextUrl

	// Handle /shop -> /shop/all/yellow-gold/all redirect
	if (pathname === '/shop') {
		const url = request.nextUrl.clone()
		url.pathname = '/shop/all/yellow-gold/all'
		return NextResponse.redirect(url)
	}

	// Handle /shop/[category] -> /shop/[category]/yellow-gold/all redirects
	const categoryMatch = pathname.match(
		/^\/shop\/(bracelets|earrings|rings|necklaces|all)$/
	)
	if (categoryMatch) {
		const category = categoryMatch[1]
		const url = request.nextUrl.clone()
		url.pathname = `/shop/${category}/yellow-gold/all`
		return NextResponse.redirect(url)
	}

	// Handle /shop/[category]/[metal] -> /shop/[category]/[metal]/all redirects
	const metalMatch = pathname.match(
		/^\/shop\/(bracelets|earrings|rings|necklaces|all)\/(yellow-gold|white-gold|rose-gold)$/
	)
	if (metalMatch) {
		const [, category, metal] = metalMatch
		const url = request.nextUrl.clone()
		url.pathname = `/shop/${category}/${metal}/all`
		return NextResponse.redirect(url)
	}

	// Handle /shop/all/[metal] -> /shop/all/[metal]/all redirects
	const allMetalMatch = pathname.match(
		/^\/shop\/all\/(yellow-gold|white-gold|rose-gold)$/
	)
	if (allMetalMatch) {
		const metal = allMetalMatch[1]
		const url = request.nextUrl.clone()
		url.pathname = `/shop/all/${metal}/all`
		return NextResponse.redirect(url)
	}

	// Only add no-cache headers in development
	const isDev = process.env.NODE_ENV === 'development'

	if (isDev) {
		return NextResponse.next({
			headers: {
				'Cache-Control':
					'no-store, no-cache, must-revalidate, proxy-revalidate',
				'Pragma': 'no-cache',
				'Expires': '0',
				'Surrogate-Control': 'no-store'
			}
		})
	}

	return NextResponse.next()
}

// Optional: limit to paths like "/api/*" or your CMS pages
export const config = {
	matcher: ['/', '/(.*)'] // apply to all paths
}
