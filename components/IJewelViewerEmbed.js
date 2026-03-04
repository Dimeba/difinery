'use client'

import { useEffect, useRef, useState } from 'react'

const IJEWEL_MINI_VIEWER_SRC =
	'https://releases.ijewel3d.com/libs/mini-viewer/0.5.4/bundle.iife.js'

const ensureIjewelScript = () => {
	return new Promise((resolve, reject) => {
		if (typeof window === 'undefined') return resolve()
		if (window.ijewelViewer) return resolve()

		const existingScript = document.querySelector(
			`script[src="${IJEWEL_MINI_VIEWER_SRC}"]`
		)

		if (existingScript) {
			existingScript.addEventListener('load', resolve, { once: true })
			existingScript.addEventListener(
				'error',
				() => reject(new Error('Failed to load iJewel3D script')),
				{ once: true }
			)
			return
		}

		const script = document.createElement('script')
		script.src = IJEWEL_MINI_VIEWER_SRC
		script.async = true
		script.onload = () => resolve()
		script.onerror = () => reject(new Error('Failed to load iJewel3D script'))
		document.body.appendChild(script)
	})
}

const IJewelViewerEmbed = ({ modelId, className }) => {
	const rootRef = useRef(null)
	const [useIframeFallback, setUseIframeFallback] = useState(false)

	useEffect(() => {
		let isCancelled = false

		const loadViewer = async () => {
			try {
				await ensureIjewelScript()
				if (isCancelled || !rootRef.current) return

				if (!window.ijewelViewer?.loadModelById) {
					throw new Error('iJewel3D viewer API unavailable')
				}

				rootRef.current.innerHTML = ''
				window.ijewelViewer.loadModelById(modelId, 'drive', rootRef.current, {
					showCard: false,
					showLogo: false
				})
			} catch (error) {
				console.error('Failed to initialize iJewel3D viewer', error)
				if (!isCancelled) {
					setUseIframeFallback(true)
				}
			}
		}

		loadViewer()

		return () => {
			isCancelled = true
			if (rootRef.current) {
				rootRef.current.innerHTML = ''
			}
		}
	}, [modelId])

	if (useIframeFallback) {
		return (
			<iframe
				title='iJewel3D viewer'
				frameBorder='0'
				allowFullScreen
				allow='autoplay; fullscreen; xr-spatial-tracking; web-share'
				src={`https://drive.ijewel3d.com/drive/files/${modelId}/embedded`}
				className={className}
			/>
		)
	}

	return <div ref={rootRef} className={className} aria-label='iJewel3D viewer' />
}

export default IJewelViewerEmbed
