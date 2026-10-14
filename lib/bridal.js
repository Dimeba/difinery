export const BRIDAL_PAGES = [
	{
		slug: 'promise-rings',
		title: 'Promise Rings',
		handle: 'promise-collection'
	},
	{
		slug: 'engagement-rings',
		title: 'Engagement Rings',
		handle: 'engagement-rings',
		showHero: true
	},
	{
		slug: 'wedding-bands',
		title: 'Wedding Bands',
		handle: 'wedding-bands'
	}
]

export function getBridalPage(slug) {
	return BRIDAL_PAGES.find(page => page.slug === slug) || null
}
