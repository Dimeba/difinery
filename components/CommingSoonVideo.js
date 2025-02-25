'use client'

import { useState, useEffect } from 'react'

const CommingSoonVideo = () => {
	const videoURLS = {
		mobile: '/comming-soon-video-mobile.mp4',
		mobilePlaceholder: '/comming-soon-video-mobile.jpg',
		desktop: '/comming-soon-video-desktop.mp4',
		desktopPlaceholder: '/comming-soon-video-desktop.jpg'
	}

	const [video, setVideo] = useState(null)
	const [placeholder, setPlaceholder] = useState(null)

	const updateVideoSource = () => {
		if (window.innerWidth < window.innerHeight) {
			setVideo(videoURLS.mobile)
			setPlaceholder(videoURLS.mobilePlaceholder)
		} else {
			setVideo(videoURLS.desktop)
			setPlaceholder(videoURLS.desktopPlaceholder)
		}
	}

	useEffect(() => {
		if (typeof window !== 'undefined') {
			updateVideoSource()
			window.addEventListener('resize', updateVideoSource)
			return () => window.removeEventListener('resize', updateVideoSource)
		}
	}, [])

	if (!video) return null

	return (
		<video
			autoPlay
			muted
			playsInline
			preload='auto'
			style={{
				width: '100%',
				height: '100%',
				objectFit: 'cover',
				transition: 'opacity 0.5s ease'
			}}
			poster={placeholder}
			loop
		>
			<source src={video} type='video/mp4' />
		</video>
	)
}

export default CommingSoonVideo
