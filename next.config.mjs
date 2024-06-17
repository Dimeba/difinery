/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		space: process.env.NEXT_PUBLIC_CHEC_PUBLIC_API_KEY,
		domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
		token: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
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
			}
		],
		formats: ['image/avif', 'image/webp'],
		deviceSizes: [640, 768, 1024, 1280, 1600]
	}
}

export default nextConfig
