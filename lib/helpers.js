export const returnMetalType = option => {
	switch (true) {
		// case option.includes('rose'):
		// 	return 'rose.png'
		case option.toLowerCase().includes('yellow'):
			return 'yellow-gold.png'
		case option.toLowerCase().includes('white'):
			return 'white-gold.png'
		default:
			return ''
	}
}

export const returnDiamondShape = option => {
	switch (true) {
		// case option.includes('rose'):
		// 	return 'rose.png'
		case option.toLowerCase().includes('pear'):
			return 'pear.svg'
		case option.toLowerCase().includes('heart'):
			return 'heart.svg'
		default:
			return ''
	}
}
