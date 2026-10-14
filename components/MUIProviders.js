'use client'
import { ThemeProvider, CssBaseline } from '@/lib/mui'
import theme from '@/app/theme/theme'

export default function MUIProviders({ children }) {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	)
}
