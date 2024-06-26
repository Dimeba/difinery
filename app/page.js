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
								link={section.fields.link}
							/>
						)
					case 'banner':
						if (section.fields.layout == 'Full Width') {
							return (
								<Banner
									key={section.sys.id}
									title={section.fields.title}
									text={section.fields.text}
									links={section.fields.links}
									image={section.fields.image}
									video={section.fields.video}
									showControls={section.fields.showVideoControls}
								/>
							)
						} else if (section.fields.layout == 'Two Columns') {
							return (
								<ColumnsContent
									key={section.sys.id}
									title={section.fields.title}
									text={section.fields.text}
									image={section.fields.image}
									links={section.fields.links}
								/>
							)
						}
					case 'features':
						return <Features key={index} features={section.fields.features} />

					default:
						return null
				}
			})}

			<Products title='Shop by Category' categories={collections} />
		</main>
	)
}
