// components
import Hero from '@/components/Hero'
import Banner from '@/components/Banner'
import Features from '@/components/Features'
import ProductsSection from '@/components/ProductsSection'
import ColumnsContent from '@/components/ColumnsContent'
import SimpleRow from '@/components/SimpleRow'
import SaleHero from '@/components/SaleHero'
import RichText from '@/components/RichText'

const PageContent = ({ content }) => {
	return (
		<main>
			{content.sections.map((section, index) => {
				switch (section.sys.contentType.sys.id) {
					case 'hero':
						return (
							<Hero
								key={index}
								title={section.fields.title}
								stylizedTitle={section.fields.stylizedTitle}
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
									stylizedTitle={section.fields.stylizedTitle}
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
									stylizedTitle={section.fields.stylizedTitle}
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
									stylizedTitle={section.fields.stylizedTitle}
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
									stylizedTitle={section.fields.stylizedTitle}
									text={section.fields.text}
								/>
							)
						} else if (section.fields.layout == 'Top') {
							return (
								<Banner
									key={section.sys.id}
									title={section.fields.title}
									stylizedTitle={section.fields.stylizedTitle}
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

					default:
						return null
				}
			})}
		</main>
	)
}

export default PageContent
