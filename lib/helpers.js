export const returnMetalType = option => {
	switch (true) {
		case option.includes('rose'):
			return 'rose.png'
		case option.includes('yellow'):
			return 'yellow.png'
		case option.includes('white'):
			return 'white.png'
		default:
			return ''
	}
}
