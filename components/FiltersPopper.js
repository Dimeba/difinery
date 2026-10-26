'use client'

import Filters from './Filters'
import { Popper } from '@/lib/mui'

// The Sort & Filter panel. Loaded on demand by Products (next/dynamic), so its
// code only downloads once someone opens it.
const FiltersPopper = ({ open, placement, anchorEl, ...filterProps }) => (
	<Popper open={open} placement={placement} anchorEl={anchorEl}>
		<Filters {...filterProps} />
	</Popper>
)

export default FiltersPopper
