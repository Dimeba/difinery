// components
import Banner from '@/components/Banner'
import ColumnsContent from '@/components/ColumnsContent'
import SimpleRow from '@/components/SimpleRow'

// lib
import { getEntries } from '@/lib/contentful'

export default async function Education() {
	// Contentful
	const pages = await getEntries('page')
	const content = pages.items.find(
		page => page.fields.title == 'Education'
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
