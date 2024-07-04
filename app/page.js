// components
import Hero from '@/components/Hero'
import Banner from '@/components/Banner'
import Features from '@/components/Features'
import Products from '@/components/Products'
import ColumnsContent from '@/components/ColumnsContent'

// lib
import { getEntries } from '@/lib/contentful'

export default async function Home() {
	// Contentful
	const pages = await getEntries('page')
	const content = pages.items.find(
		page => page.fields.title == 'Homepage'
	).fields

	return (
		<main>
			{content.sections.map(section => {
				switch (section.sys.contentType.sys.id) {
					case 'hero':
						return (
							<Hero
								key={section.sys.id}
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
						} else if (section.fields.layout == 'Two Columns Reverse') {
							return (
								<ColumnsContent
									key={section.sys.id}
									title={section.fields.title}
									text={section.fields.text}
									image={section.fields.image}
									links={section.fields.links}
									reverse
								/>
							)
						} else if (section.fields.layout == 'Simple') {
							return (
								<SimpleRow
									key={section.sys.id}
									title={section.fields.title}
									text={section.fields.text}
								/>
							)
						} else if (section.fields.layout == 'Top') {
							return (
								<Banner
									key={section.sys.id}
									title={section.fields.title}
									text={section.fields.text}
									links={section.fields.links}
									image={section.fields.image}
									video={section.fields.video}
									showControls={section.fields.showVideoControls}
									top
								/>
							)
						}
					case 'features':
						return (
							<Features
								key={section.sys.id}
								features={section.fields.features}
								title={section.fields.title}
							/>
						)
					case 'products':
						return (
							<Products
								key={section.sys.id}
								title={section.fields.title}
								showTitle={section.fields.showTitle}
								type={section.fields.type}
								categories={section.fields.collections}
								showPrice={section.fields.showPrice}
							/>
						)

					default:
						return null
				}
			})}
		</main>
	)
}
