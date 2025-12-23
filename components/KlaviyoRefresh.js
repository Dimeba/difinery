'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function hasKlaviyoEmbeds() {
	if (typeof document === 'undefined') return false
	return Boolean(
		document.querySelector(
			'[class*="klaviyo-form-"] , [class^="klaviyo-form-"]'
		)
	)
}

function getKlaviyoEmbedNodes() {
	if (typeof document === 'undefined') return []
	return Array.from(
		document.querySelectorAll('[class*="klaviyo-form-"] , [class^="klaviyo-form-"]')
	)
}

function embedsLookUnrendered(nodes) {
	// When Klaviyo renders an embed, it typically injects child elements.
	return nodes.some(node => node && node.childElementCount === 0)
}

function reinjectKlaviyoOnsiteScript() {
	if (typeof document === 'undefined') return

	const baseSrc =
		'https://static.klaviyo.com/onsite/js/SV87h3/klaviyo.js?company_id=SV87h3'
	const srcWithCb = `${baseSrc}&cb=${Date.now()}`

	const script = document.createElement('script')
	script.async = true
	script.src = srcWithCb
	// Avoid duplicate IDs; Next/Script already uses id='klaviyo-onsite'.
	script.setAttribute('data-klaviyo-reinject', 'true')
	document.head.appendChild(script)
}

function softResetKlaviyoRuntime() {
	if (typeof window === 'undefined') return

	// Klaviyo's embed renderer sometimes misses SPA-inserted placeholders.
	// There's no stable public "refresh embeds" API exposed in all configs,
	// so we do a conservative reset of the module loader and re-inject the script.
	try {
		delete window.klaviyoModulesObject
	} catch (_) {
		// no-op
	}

	return
}

export default function KlaviyoRefresh() {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const lastEnsureAtRef = useRef(0)
	const reinjectAttemptsRef = useRef(0)
	const ensureTimerRef = useRef(null)

	const ensureEmbedsRender = () => {
		if (typeof window === 'undefined') return
		if (!hasKlaviyoEmbeds()) return

		const nodes = getKlaviyoEmbedNodes()
		if (!embedsLookUnrendered(nodes)) return

		// Don't loop forever. If Klaviyo is down/blocked, we should fail quietly.
		if (reinjectAttemptsRef.current >= 2) return
		reinjectAttemptsRef.current += 1

		softResetKlaviyoRuntime()
		reinjectKlaviyoOnsiteScript()
	}

	const scheduleEnsure = () => {
		if (ensureTimerRef.current) clearTimeout(ensureTimerRef.current)
		ensureTimerRef.current = setTimeout(ensureEmbedsRender, 250)
	}

	useEffect(() => {
		reinjectAttemptsRef.current = 0
		scheduleEnsure()
		const t1 = setTimeout(ensureEmbedsRender, 600)
		const t2 = setTimeout(ensureEmbedsRender, 1600)
		return () => {
			clearTimeout(t1)
			clearTimeout(t2)
			if (ensureTimerRef.current) clearTimeout(ensureTimerRef.current)
		}
	}, [pathname, searchParams])

	useEffect(() => {
		if (typeof window === 'undefined' || typeof document === 'undefined') return

		const throttleMs = 500
		const observer = new MutationObserver(() => {
			if (!hasKlaviyoEmbeds()) return
			const now = Date.now()
			if (now - lastEnsureAtRef.current < throttleMs) return
			lastEnsureAtRef.current = now
			scheduleEnsure()
		})

		observer.observe(document.body, {
			childList: true,
			subtree: true
		})

		return () => observer.disconnect()
	}, [])

	return null
}
