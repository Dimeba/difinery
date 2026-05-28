// components
import Features from '@/components/Features'
import Products from '@/components/Products'
import RichText from '@/components/RichText'
import Columns from './Columns'
import FAQ from './FAQ'
import MasonryColumns from './MasonryColumns'
import SubscribeSection from './SubscribeSection'
import SubscribeHero from './SubscribeHero'
import SpecialRequestBanner from './SpecialRequestBanner'
import SplitFeatures from './SplitFeatures'
import Infographic from './Infographic'
import Timeline from './Timeline'
import Articles from './Articles'
import ContactForm from './ContactForm'

const PageContent = ({ content, slug }) => {
	const hasPageHero = slug === 'subscribe'
	return (
		<main>
			{/* Content */}
			{/* <SpecialRequestBanner /> */}

			<SubscribeHero />

			{content.sections.map((section, index) => {
				switch (section.sys.contentType.sys.id) {
					case 'features':
						if (section.fields.type === 'Standard') {
							return (
								<Features
									key={index}
									features={section.fields.features}
									title={section.fields.title}
									stylizedTitle={section.fields.stylizedTitle}
									h4text={section.fields.h4text}
									description={section.fields.description}
									borderTop={section.fields.borderTop}
								/>
							)
						}
						if (section.fields.type === 'Infographic') {
							return (
								<Infographic
									key={index}
									features={section.fields.features}
									title={section.fields.title}
									stylizedTitle={section.fields.stylizedTitle}
									graphic={section.fields.graphic}
								/>
							)
						}
						if (section.fields.type === 'Timeline') {
							return (
								<Timeline
									key={index}
									features={section.fields.features}
									title={section.fields.title}
									stylizedTitle={section.fields.stylizedTitle}
								/>
							)
						}
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
								thin={section.fields.thin}
								centerAlignText={section.fields.centerAlignText}
								isFirstOnPage={index === 0 && !hasPageHero}
							/>
						)
					case 'section':
						return (
							<Columns
								key={section.sys.id}
								title={section.fields.title}
								showTitle={section.fields.showTitle}
								stylizedTitle={section.fields.stylizedTitle}
								subtitle={section.fields.subtitle}
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
					case 'splitFeatures':
						return (
							<SplitFeatures
								key={section.sys.id}
								title={section.fields.title}
								row1title={section.fields.row1title}
								row1={section.fields.row1}
								row2Title={section.fields.row2Title}
								row2={section.fields.row2}
								row3Title={section.fields.row3Title}
								row3={section.fields.row3}
							/>
						)
					case 'articles':
						return (
							<Articles
								key={section.sys.id}
								articles={section.fields.articles}
							/>
						)

					default:
						return null
				}
			})}

			{/* Subscribe Section */}
			<SubscribeSection />

			{/* Help & Contact only */}
			{slug === 'help-contact' && <ContactForm />}
		</main>
	)
}

export default PageContent
