// components
import Column from './Column'
import { Grid, Stack, Box, Typography } from '@mui/material'
import Image from 'next/image'

const MasonryColumns = ({ content }) => {
	return (
		<Grid container spacing={0}>
			<Grid size={{ xs: 12, sm: 6 }} height={'680px'}>
				<Column id={content[0].sys.id} columns={2} height='100%' />
			</Grid>
			<Grid size={{ xs: 12, sm: 6 }}>
				<Stack sx={{ width: '100%' }} height={'680px'}>
					<Column id={content[1].sys.id} columns={2} height='100%' />
					<Column id={content[2].sys.id} columns={2} height='100%' />
				</Stack>
			</Grid>
		</Grid>
	)
}

export default MasonryColumns
