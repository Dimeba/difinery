export const returnMetalType = option => {
	switch (true) {
		// case option.includes('rose'):
		// 	return 'rose.png'
		case option.includes('yellow'):
			return 'yellow-gold.png'
		case option.includes('white'):
			return 'white-gold.png'
		default:
			return ''
	}
}
