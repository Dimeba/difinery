// styles
import styles from './Columns.module.scss'

// components
import { Box, Typography } from '@mui/material'
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
	subtitle,
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
							<Typography
								variant='h3'
								fontWeight={300}
								marginBottom={subtitle ? 0 : '4rem'}
							>
								{title}
							</Typography>
						)}
					</>
				)}

				{subtitle && (
					<Box
						marginBottom={'4rem'}
						sx={{
							'& *': {
								textAlign: 'center'
							}
						}}
					>
						{documentToReactComponents(subtitle)}
					</Box>
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
