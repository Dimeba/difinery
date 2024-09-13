// components
import Features from '@/components/Features'
import ProductsSection from '@/components/ProductsSection'
import SaleHero from '@/components/SaleHero'
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
						switch (section.fields.type) {
							case 'sale':
								return (
									<SaleHero
										key={section.sys.id}
										products={
											section.fields.products &&
											section.fields.products.slice(0, 2)
										}
										variants={
											section.fields.variants &&
											section.fields.variants.slice(0, 2)
										}
										image={section.fields.saleImage.fields.file.url}
										title={section.fields.title}
										stylizedTitle={section.fields.stylizedTitle}
										text={section.fields.saleText}
									/>
								)
							default:
								return (
									<ProductsSection
										key={section.sys.id}
										title={section.fields.title}
										stylizedTitle={section.fields.stylizedTitle}
										showTitle={section.fields.showTitle}
										type={section.fields.type}
										categories={section.fields.collections}
										products={section.fields.products}
										// variants={section.fields.variants}
										showPrice={section.fields.showPrice}
										threeColumn={section.fields.columns == '3' ? true : false}
										fullWidth={section.fields.fullWidth}
										gap={section.fields.gap}
									/>
								)
						}

					case 'richText':
						return (
							<RichText
								key={section.sys.id}
								title={section.fields.title}
								stylizedTitle={section.fields.stylizedTitle}
								content={section.fields.content}
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
