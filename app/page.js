// components
import Hero from '@/components/Hero'
import Banner from '@/components/Banner'
import Features from '@/components/Features'
import Products from '@/components/Products'

// lib
import { getCollections } from '@/lib/shopify'
import { getEntries } from '@/lib/contentful'

export default async function Home() {
	// Shopify
	const collections = await getCollections()

	// Contentful
	const pages = await getEntries('page')
	const content = pages.items.find(
		page => page.fields.title == 'Homepage'
	).fields

	return (
		<main>
			{content.sections.map((section, index) => {
				switch (section.sys.contentType.sys.id) {
					case 'hero':
						return (
							<Hero
								key={index}
								title={section.fields.title}
								text={section.fields.text}
								image={section.fields.image.fields.file.url}
							/>
						)
					case 'banner':
						return (
							<Banner
								key={index}
								title={section.fields.title}
								text={section.fields.text}
								links={section.fields.links}
								image={section.fields.image}
								video={section.fields.video}
								showControls={section.fields.showVideoControls}
							/>
						)

					default:
						return null
				}
			})}

			<Features />
			<Products title='Shop by Category' categories={collections} />
		</main>
	)
}
