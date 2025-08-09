// components
import { Typography } from '@mui/material'

const SplitFeatures = ({
	title,
	row1title,
	row1,
	row2Title = null,
	row2 = null,
	row3Title = null,
	row3 = null
}) => {
	return (
		<section>
			<div className='container'>
				<Typography variant='h3' fontWeight={300} marginBottom={'4rem'}>
					{title}
				</Typography>
			</div>
		</section>
	)
}

export default SplitFeatures
