/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		space: process.env.NEXT_PUBLIC_CHEC_PUBLIC_API_KEY
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.chec.io',
				pathname: '**'
			}
		],
		formats: ['image/avif', 'image/webp'],
		deviceSizes: [640, 768, 1024, 1280, 1600]
	}
}

export default nextConfig
