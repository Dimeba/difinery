export const returnMetalType = option => {
	const lc = (option || '').toLowerCase()
	const hasWhite = lc.includes('white')
	const hasYellow = lc.includes('yellow')

	// Both metals selected
	if (hasWhite && hasYellow) return 'multi-gold.png'

	// Single metal selections
	if (hasYellow) return 'yellow-gold.png'
	if (hasWhite) return 'white-gold.png'

	return ''
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
