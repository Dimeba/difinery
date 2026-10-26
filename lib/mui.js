'use client'

import { forwardRef } from 'react'
import { unstable_extendSxProp as extendSxProp } from '@mui/system'
import MuiBox from '@mui/material/Box'
import MuiGrid from '@mui/material/Grid'
import MuiStack from '@mui/material/Stack'
import MuiTypography from '@mui/material/Typography'

// MUI 9 stopped folding system props (display, position, padding, …) into `sx`.
// This restores that behavior for the components this app already uses that way.
function withSystemProps(Component) {
	const Wrapped = forwardRef(function SystemProps(props, ref) {
		return <Component ref={ref} {...extendSxProp(props)} />
	})
	Wrapped.muiName = Component.muiName
	return Wrapped
}

export const Box = withSystemProps(MuiBox)
export const Grid = withSystemProps(MuiGrid)
export const Stack = withSystemProps(MuiStack)
export const Typography = withSystemProps(MuiTypography)

export { default as Button } from '@mui/material/Button'
export { default as ClickAwayListener } from '@mui/material/ClickAwayListener'
export { default as CssBaseline } from '@mui/material/CssBaseline'
export { default as Input } from '@mui/material/Input'
export { default as InputAdornment } from '@mui/material/InputAdornment'
export { default as Popper } from '@mui/material/Popper'
export { default as Skeleton } from '@mui/material/Skeleton'
export { default as TextField } from '@mui/material/TextField'
export { default as useMediaQuery } from '@mui/material/useMediaQuery'
export { createTheme, ThemeProvider } from '@mui/material/styles'
