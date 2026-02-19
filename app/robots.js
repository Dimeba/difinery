export default function robots() {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/api/', '/admin/']
		},
		sitemap: `${
			process.env.NEXT_PUBLIC_SITE_URL || 'https://difinery.com'
		}/sitemap.xml`
	}
}
