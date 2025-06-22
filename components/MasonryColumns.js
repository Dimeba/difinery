// components
import Column from './Column'
import { Grid, Stack, Box, Typography } from '@mui/material'
import Image from 'next/image'

const MasonryColumns = ({ content }) => {
	return (
		<Grid container spacing={0}>
			<Grid item size={{ xs: 12, sm: 6 }}>
				<Column id={content[0].sys.id} columns={content.length} height='100%' />
			</Grid>
			<Grid item size={{ xs: 12, sm: 6 }}>
				<Stack sx={{ width: '100%' }}>
					<Column
						id={content[1].sys.id}
						columns={content.length}
						height='100%'
					/>
					<Column
						id={content[2].sys.id}
						columns={content.length}
						height='100%'
					/>
				</Stack>
			</Grid>
		</Grid>
	)
}

export default MasonryColumns
