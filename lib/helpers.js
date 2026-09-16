export const isMetalOptionName = name => {
	const n = (name || '').toLowerCase().trim()
	return n === 'metal' || n === 'gold color'
}

export const findMetalOption = options =>
	(options || []).find(o => isMetalOptionName(o?.name))

export const returnMetalType = option => {
	const lc = (option || '').toLowerCase()
	const hasWhite = lc.includes('white')
	const hasYellow = lc.includes('yellow')
	const hasRose = lc.includes('rose')

	// Both metals selected
	if (hasWhite && hasYellow) return 'multi-gold.png'

	// Single metal selections
	if (hasYellow) return 'yellow-gold.png'
	if (hasWhite) return 'white-gold.png'
	if (hasRose) return 'rose-gold.png'

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
