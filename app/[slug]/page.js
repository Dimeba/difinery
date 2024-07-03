// components
import Hero from '@/components/Hero'
import Banner from '@/components/Banner'
import Features from '@/components/Features'
import Products from '@/components/Products'
import ColumnsContent from '@/components/ColumnsContent'

// lib
import { getEntries } from '@/lib/contentful'

const pages = await getEntries('page')

export async function generateStaticParams() {
	return pages.items.map(page => ({
		slug: page.fields.title.toLowerCase().replace(/ /g, '-')
	}))
}

export default async function Product({ params }) {
	const { slug } = params

	const content = pages.items.find(
		page => page.fields.title.toLowerCase().replace(/ /g, '-') == slug
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
								key={index}
								features={section.fields.features}
								title={section.fields.title}
							/>
						)

					default:
						return null
				}
			})}
		</main>
	)
}
