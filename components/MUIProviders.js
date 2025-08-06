'use client'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '@/app/theme/theme'

export default function MUIProviders({ children }) {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	)
}
