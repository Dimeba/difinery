// Shared MUI TextField overrides for the account forms.
// Same treatment ContactForm.js applies, kept in one place here because four
// account forms need it.

export const inputSx = {
	width: '100%',
	'& .MuiInputBase-input': {
		fontSize: '14px',
		color: 'black'
	},
	'& .MuiInputLabel-root': {
		fontSize: '14px',
		color: 'black'
	},
	'& .MuiInput-underline:before': {
		borderBottomColor: 'rgba(0, 0, 0, 0.42)'
	},
	'& .MuiInput-underline:hover:not(.Mui-disabled):before': {
		borderBottomColor: 'black'
	},
	'& .MuiInput-underline:after': {
		borderBottomColor: 'black'
	}
}
