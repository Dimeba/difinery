/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development'

const nextConfig = {
	env: {
		// Chec & Shopify API keys
		// space: process.env.NEXT_PUBLIC_CHEC_PUBLIC_API_KEY,
		domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
		token: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
		// Contenrful API keys
		space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
		accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_KEY
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.chec.io',
				pathname: '**'
			},
			{
				protocol: 'https',
				hostname: 'cdn.shopify.com',
				pathname: '/s/files/**'
			},
			{
				protocol: 'https',
				hostname: 'images.ctfassets.net',
				pathname: '**'
			},
			{
				protocol: 'https',
				hostname: 'downloads.ctfassets.net',
				pathname: '**'
			}
		],
		formats: ['image/avif', 'image/webp'],
		deviceSizes: [640, 768, 1024, 1280, 1600]
	},
	experimental: {
		middlewarePrefetch: isDev ? 'flexible' : 'strict' // Disable route prefetch cache in dev
	},

	// Apply no-cache headers during development
	async headers() {
		if (!isDev) return []
		return [
			{
				source: '/(.*)', // Match all routes
				headers: [
					{
						key: 'Cache-Control',
						value: 'no-store, no-cache, must-revalidate, proxy-revalidate'
					},
					{ key: 'Pragma', value: 'no-cache' },
					{ key: 'Expires', value: '0' },
					{ key: 'Surrogate-Control', value: 'no-store' }
				]
			}
		]
	}
}

export default nextConfig
