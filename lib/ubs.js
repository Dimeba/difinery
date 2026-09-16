// UBS staff program. SERVER ONLY.
//
// The discount code and the eligible domains are read straight from
// process.env and are deliberately NOT added to the `env:` block in
// next.config.mjs, so neither reaches the client bundle.

export function getUbsDiscountCode() {
	return process.env.UBS_DISCOUNT_CODE || null
}

/** `UBS_ELIGIBLE_DOMAINS=ubs.com,desophy.com` → ['ubs.com', 'desophy.com'] */
export function getEligibleDomains() {
	return (process.env.UBS_ELIGIBLE_DOMAINS || '')
		.split(',')
		.map(domain => domain.trim().toLowerCase())
		.filter(Boolean)
}

/**
 * Exact domain match on the part after the last "@", so lookalikes such as
 * "notubs.com" or "ubs.com.evil.io" are rejected.
 */
export function isUbsEligibleEmail(email) {
	if (typeof email !== 'string') return false
	const at = email.lastIndexOf('@')
	if (at < 1) return false
	const domain = email.slice(at + 1).trim().toLowerCase()
	return getEligibleDomains().includes(domain)
}
