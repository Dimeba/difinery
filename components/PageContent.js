// components
import Features from '@/components/Features'
import Products from '@/components/Products'
import RichText from '@/components/RichText'
import Columns from './Columns'
import FAQ from './FAQ'
import MasonryColumns from './MasonryColumns'

const PageContent = ({ content }) => {
	return (
		<main>
			{/* Content */}
			{content.sections.map((section, index) => {
				switch (section.sys.contentType.sys.id) {
					case 'features':
						return (
							<Features
								key={index}
								features={section.fields.features}
								title={section.fields.title}
								stylizedTitle={section.fields.stylizedTitle}
							/>
						)
					case 'products':
						return (
							<Products
								key={section.sys.id}
								title={section.fields.title}
								stylizedTitle={section.fields.stylizedTitle}
								showTitle={section.fields.showTitle}
								collections={section.fields.collections}
								discount={section.fields.discount}
								showFilters={section.fields.showFilters}
							/>
						)

					case 'richText':
						return (
							<RichText
								key={section.sys.id}
								title={section.fields.title}
								stylizedTitle={section.fields.stylizedTitle}
								content={section.fields.content}
								index={index}
							/>
						)
					case 'section':
						return (
							<Columns
								key={section.sys.id}
								title={section.fields.title}
								showTitle={section.fields.showTitle}
								stylizedTitle={section.fields.stylizedTitle}
								gap={section.fields.gap}
								content={section.fields.columns}
								fullHeight={section.fields.fullHeight}
								fullWidth={section.fields.fullWidth}
								marginTop={section.fields.marginTop}
								marginBottom={section.fields.marginBottom}
								mobileColumns={section.fields.mobileColumns}
							/>
						)
					case 'accordion':
						return (
							<FAQ
								key={section.sys.id}
								title={section.fields.title}
								content={section.fields.rows}
							/>
						)
					case 'masonryColumns':
						return (
							<MasonryColumns
								key={section.sys.id}
								content={section.fields.columns}
							/>
						)

					default:
						return null
				}
			})}
		</main>
	)
}

export default PageContent
