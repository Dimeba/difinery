'use client'

import { useEffect } from 'react'

// GTM (and the GA4 it pulls in), the Meta Pixel, Clarity and Klaviyo cost over
// a second of main-thread time on a mid-range phone. They load on the visitor's first
// interaction, or after FALLBACK_MS at the latest, so they stay out of the
// initial load. Events fired before then wait in window.dataLayer, which GTM
// replays when it boots.
const FALLBACK_MS = 10000
const INTERACTION_EVENTS = [
	'pointerdown',
	'mousemove',
	'touchstart',
	'scroll',
	'keydown'
]

function loadGtm(gtmId) {
	window.dataLayer = window.dataLayer || []
	window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
	const script = document.createElement('script')
	script.async = true
	script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`
	document.head.appendChild(script)
}

function loadMetaPixel(pixelId) {
	!(function (f, b, e, v, n, t, s) {
		if (f.fbq) return
		n = f.fbq = function () {
			n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
		}
		if (!f._fbq) f._fbq = n
		n.push = n
		n.loaded = !0
		n.version = '2.0'
		n.queue = []
		t = b.createElement(e)
		t.async = !0
		t.src = v
		s = b.getElementsByTagName(e)[0]
		s.parentNode.insertBefore(t, s)
	})(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
	window.fbq('init', pixelId)
	window.fbq('track', 'PageView')
}

function loadClarity(projectId) {
	window.clarity =
		window.clarity ||
		function () {
			;(window.clarity.q = window.clarity.q || []).push(arguments)
		}
	const script = document.createElement('script')
	script.async = true
	script.src = `https://www.clarity.ms/tag/${projectId}`
	document.head.appendChild(script)
}

// Onsite script for popups and tracking. The site has no embedded Klaviyo
// forms (the newsletter form posts to /api/klaviyo), so nothing renders
// waiting for it; queued _learnq calls are picked up when it loads.
function loadKlaviyo(companyId) {
	const script = document.createElement('script')
	script.async = true
	script.src = `https://static.klaviyo.com/onsite/js/${companyId}/klaviyo.js?company_id=${companyId}`
	document.head.appendChild(script)
}

export default function DeferredAnalytics({
	gtmId,
	metaPixelId,
	clarityId,
	klaviyoCompanyId
}) {
	useEffect(() => {
		let loaded = false
		let timer

		const load = () => {
			if (loaded) return
			loaded = true
			cleanup()
			if (gtmId) loadGtm(gtmId)
			if (metaPixelId) loadMetaPixel(metaPixelId)
			if (clarityId) loadClarity(clarityId)
			if (klaviyoCompanyId) loadKlaviyo(klaviyoCompanyId)
		}

		function cleanup() {
			clearTimeout(timer)
			INTERACTION_EVENTS.forEach(event =>
				window.removeEventListener(event, load, { passive: true })
			)
		}

		INTERACTION_EVENTS.forEach(event =>
			window.addEventListener(event, load, { once: true, passive: true })
		)
		timer = setTimeout(load, FALLBACK_MS)

		return cleanup
	}, [gtmId, metaPixelId, clarityId, klaviyoCompanyId])

	return null
}
