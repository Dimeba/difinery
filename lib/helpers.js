export const isMetalOptionName = name => {
	const n = (name || '').toLowerCase().trim()
	return n === 'metal' || n === 'gold color'
}

export const findMetalOption = options =>
	(options || []).find(o => isMetalOptionName(o?.name))

// Turns a selected metal (a Shopify value such as "White Gold" or
// "Yellow & White", or a stackable image code such as "Stackable-YYW") into
// the ?gold= value product pages read: "yellow", "white", "rose" or a
// combination like "yellow-and-white". Returns null when no color is found.
export const metalToGoldParam = metal => {
	const lc = (metal || '').toLowerCase().trim()
	if (!lc) return null

	const found = new Set()
	if (lc.startsWith('stackable-')) {
		const codes = { y: 'yellow', w: 'white', r: 'rose' }
		for (const ch of lc.replace('stackable-', '')) {
			if (codes[ch]) found.add(codes[ch])
		}
	} else {
		if (lc.includes('yellow')) found.add('yellow')
		if (lc.includes('white')) found.add('white')
		if (lc.includes('rose') || lc.includes('pink')) found.add('rose')
	}

	const colors = ['yellow', 'white', 'rose'].filter(c => found.has(c))
	return colors.length ? colors.join('-and-') : null
}

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
