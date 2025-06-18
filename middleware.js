// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
	return NextResponse.next({
		headers: {
			'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
			'Pragma': 'no-cache',
			'Expires': '0',
			'Surrogate-Control': 'no-store'
		}
	})
}

// Optional: limit to paths like "/api/*" or your CMS pages
export const config = {
	matcher: ['/', '/(.*)'] // apply to all paths
}
