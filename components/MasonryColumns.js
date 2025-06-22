// components
import Column from './Column'
import { Grid, Stack, Box, Typography } from '@mui/material'

const MasonryColumns = ({ content }) => {
	return (
		<Grid container spacing={0}>
			<Grid size={6}>
				<Column id={content[0].sys.id} columns={content.length} />
			</Grid>
			<Grid size={6}>
				<Stack>
					<Column id={content[1].sys.id} columns={content.length} />
					<Column id={content[2].sys.id} columns={content.length} />
				</Stack>
			</Grid>
		</Grid>
	)
}

export default MasonryColumns
