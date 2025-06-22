// styles
import styles from './Columns.module.scss'

// components
import Column from './Column'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

const Columns = ({
	fullWidth,
	fullHeight,
	gap,
	content,
	title,
	showTitle,
	stylizedTitle,
	marginTop,
	marginBottom,
	mobileColumns = 1
}) => {
	// dynamic styles
	const dynamicStyles = {
		columns: { gap: gap ? '0.3rem' : '' },
		section: {
			marginTop: marginTop ? '' : '0',
			marginBottom: marginBottom ? '' : '0'
		}
	}

	return (
		<section style={dynamicStyles.section}>
			<div className={`${fullWidth ? '' : 'container'}`}>
				{showTitle && (
					<>
						{stylizedTitle ? (
							<div className={`stylizedH3 ${styles.sectionTitle}`}>
								{documentToReactComponents(stylizedTitle)}
							</div>
						) : (
							<h3 className={styles.sectionTitle}>{title}</h3>
						)}
					</>
				)}

				<div
					className={mobileColumns == 2 ? styles.columnsGrid : styles.columns}
					style={dynamicStyles.columns}
				>
					{content.map((item, index) => (
						<Column
							key={index}
							fullHeight={fullHeight}
							id={item.sys.id}
							columns={content.length}
							mobileColumns={mobileColumns}
						/>
					))}
				</div>
			</div>
		</section>
	)
}

export default Columns
