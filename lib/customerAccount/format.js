// Shared display helpers for the account area.

export function formatMoney(money) {
	if (!money?.amount) return '—'
	try {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: money.currencyCode || 'USD'
		}).format(Number(money.amount))
	} catch {
		return `${money.amount} ${money.currencyCode || ''}`.trim()
	}
}

export function formatDate(value) {
	if (!value) return '—'
	try {
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(new Date(value))
	} catch {
		return value
	}
}

/** SCREAMING_SNAKE enum values → "Screaming snake". */
export function formatStatus(value) {
	if (!value) return ''
	return value
		.toLowerCase()
		.replace(/_/g, ' ')
		.replace(/^./, c => c.toUpperCase())
}

/**
 * Falls back to assembling the address by hand when Shopify's `formatted`
 * field is unavailable.
 */
export function addressLines(address) {
	if (!address) return ''
	if (address.formatted?.length) return address.formatted.join('\n')

	return [
		[address.firstName, address.lastName].filter(Boolean).join(' '),
		address.company,
		address.address1,
		address.address2,
		[address.city, address.zoneCode, address.zip].filter(Boolean).join(', '),
		address.territoryCode
	]
		.filter(Boolean)
		.join('\n')
}

/** Sums every store credit account, assuming a single shop currency. */
export function totalStoreCredit(accounts) {
	const nodes = accounts?.nodes || []
	if (!nodes.length) return null

	const currencyCode = nodes[0].balance?.currencyCode || 'USD'
	const amount = nodes.reduce(
		(sum, node) => sum + Number(node.balance?.amount || 0),
		0
	)
	return { amount: String(amount), currencyCode }
}
