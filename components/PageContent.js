// components
import Features from '@/components/Features'
import Products from '@/components/Products'
import RichText from '@/components/RichText'
import Columns from './Columns'
import HeaderChanger from './HeaderChanger'

const PageContent = ({ content }) => {
	return (
		<main>
			{/* Header update */}
			<HeaderChanger transparent={content.transparentHeader} />

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
