'use client'

import { createTheme } from '@mui/material'

const theme = createTheme({
	palette: {
		primary: {
			main: '#1a1b18',
			light: '#d6d6d6'
		}
	},
	typography: {
		fontFamily: "'Libre Franklin', sans-serif",
		h1: {
			fontFamily: "'Newsreader', serif",
			fontWeight: 500,
			fontSize: '42px',
			lineHeight: 1.2
		},
		h1Light: {
			fontFamily: "'Newsreader', serif",
			fontWeight: 200,
			fontSize: '42px',
			lineHeight: 1.2
		},
		h2: {
			fontFamily: "'Newsreader', serif",
			fontWeight: 300,
			fontSize: '2.25rem',
			lineHeight: 1.2
		},
		h3: {
			fontFamily: "'Newsreader', serif",
			fontWeight: 400,
			fontSize: '2rem',
			lineHeight: 1.5,
			textAlign: 'center',
			letterSpacing: 'normal'
		},
		h4: {
			fontFamily: "'Libre Franklin', sans-serif",
			fontWeight: 500,
			fontSize: '0.8rem',
			letterSpacing: '0.2em',
			textTransform: 'uppercase'
		},
		h5: {
			fontFamily: "'Newsreader', serif",
			fontWeight: 400,
			fontSize: '0.9rem'
		},
		p: {
			fontFamily: "'Libre Franklin', sans-serif",
			fontWeight: 400,
			fontSize: '12px',
			lineHeight: 1.75,
			letterSpacing: '0.5px'
		}
	}
})

export default theme
