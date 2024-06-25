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
	const homepage = await getEntries('homepage')
	const content = homepage.items[0].fields

	return (
		<main>
			<Hero
				title={content.heroTitle}
				text={content.heroText}
				image={content.heroImage.fields.file.url}
			/>
			{content.sections.map((section, index) => {
				switch (section.sys.contentType.sys.id) {
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
