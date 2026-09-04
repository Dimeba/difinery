// styles
import styles from './Columns.module.scss'

// components
import { Box, Typography } from '@mui/material'
import Column from './Column'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { getEntry } from '@/lib/contentful'

const Columns = async ({
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
	mobileColumns = 1,
	customBackgroundColor
}) => {
	const backgroundColor = customBackgroundColor
		? customBackgroundColor.startsWith('#')
			? customBackgroundColor
			: `#${customBackgroundColor}`
		: undefined

	// dynamic styles
	const dynamicStyles = {
		columns: { gap: gap ? '0.3rem' : '' },
		section: {
			marginTop: marginTop ? '' : '0',
			marginBottom: marginBottom ? '' : '0',
			...(backgroundColor ? { backgroundColor } : {})
		}
	}

	const columnsMeta = await Promise.all(
		content.map(async item => {
			const entry = await getEntry(item.sys.id)
			const type = entry?.fields?.type || ''
			const hasMediaType = type === 'image' || type === 'video'
			const hasMediaAsset = Boolean(entry?.fields?.media)
			return {
				item,
				hasMedia: hasMediaType || hasMediaAsset
			}
		})
	)

	const hasTwoColumns = columnsMeta.length === 2
	const hasExactlyOneMediaColumn =
		columnsMeta.filter(column => column.hasMedia).length === 1
	const shouldReorderForMobile = hasTwoColumns && hasExactlyOneMediaColumn

	return (
		<section
			className={backgroundColor ? styles.withCustomBackground : undefined}
			style={dynamicStyles.section}
		>
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
						padding='0 5vw'
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
					className={`${mobileColumns == 2 ? styles.columnsGrid : styles.columns} ${
						shouldReorderForMobile ? styles.mediaFirstOnMobile : ''
					}`}
					style={dynamicStyles.columns}
				>
					{columnsMeta.map(({ item, hasMedia }, index) => (
						<Column
							key={index}
							fullHeight={fullHeight}
							id={item.sys.id}
							columns={content.length}
							mobileColumns={mobileColumns}
							className={
								shouldReorderForMobile
									? hasMedia
										? styles.mobileMediaItem
										: styles.mobileTextOnlyItem
									: ''
							}
						/>
					))}
				</div>
			</div>
		</section>
	)
}

export default Columns
