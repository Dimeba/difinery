'use client'

// styles
import styles from './Columns.module.scss'

// components
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined'
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined'
import VolumeOffOutlinedIcon from '@mui/icons-material/VolumeOffOutlined'
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined'

// hooks
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useEffect, useRef, useState } from 'react'

// Start fetching a little before the video scrolls into view. Kept at module
// scope so the observer isn't torn down and re-created on every render.
const OBSERVER_OPTIONS = {
	root: null,
	rootMargin: '200px',
	threshold: 0
}

export const resolveMediaSrc = media => {
	if (!media) return undefined
	if (typeof media === 'string') return media
	return 'https:' + media.fields.file.url
}

// Every video in /public has a first-frame "<name>-poster.jpg" next to it. It
// looks exactly like the video's opening frame and paints long before the
// video itself has buffered.
const localPoster = src =>
	typeof src === 'string' && /^\/[^/]+\.mp4$/.test(src)
		? src.replace(/\.mp4$/, '-poster.jpg')
		: undefined

const Video = ({
	video,
	showControls,
	autoPlay = false,
	mute = true,
	placeholder = null,
	style,
	className,
	// Above-the-fold videos (e.g. the hero) don't wait to be scrolled to.
	eager = false
}) => {
	const [targetRef, isIntersecting] = useIntersectionObserver(OBSERVER_OPTIONS)

	const src = resolveMediaSrc(video)
	const poster = resolveMediaSrc(placeholder) || localPoster(src)

	// The file is only requested once the video has come near the viewport.
	const [hasEnteredView, setHasEnteredView] = useState(false)
	const [isPlaying, setIsPlaying] = useState(autoPlay)
	const [isMuted, setIsMuted] = useState(mute)

	if (isIntersecting && !hasEnteredView) setHasEnteredView(true)

	// An eager video with a poster shows that first frame until the page has
	// loaded, so the video download doesn't compete with the page itself.
	// Without a poster it starts at once rather than show an empty frame.
	const [pageLoaded, setPageLoaded] = useState(!(eager && poster))
	useEffect(() => {
		if (pageLoaded) return
		const done = () => setPageLoaded(true)
		if (document.readyState === 'complete') {
			const timer = setTimeout(done, 0)
			return () => clearTimeout(timer)
		}
		window.addEventListener('load', done, { once: true })
		return () => window.removeEventListener('load', done)
	}, [pageLoaded])

	const shouldLoad = pageLoaded && (eager || hasEnteredView)

	// Pause off-screen videos and resume them when they come back, unless the
	// visitor paused them. Only pause after the video has actually been seen, so
	// an eager video isn't paused before the observer's first report.
	const hasBeenVisibleRef = useRef(false)
	useEffect(() => {
		const el = targetRef.current
		if (!el || !shouldLoad) return
		if (isIntersecting) {
			hasBeenVisibleRef.current = true
			if (isPlaying) el.play().catch(() => {})
		} else if (hasBeenVisibleRef.current) {
			el.pause()
		}
	}, [isIntersecting, shouldLoad, isPlaying, targetRef])

	const togglePlay = () => {
		if (isPlaying) {
			targetRef.current.pause()
			setIsPlaying(false)
		} else {
			targetRef.current.play().catch(() => {})
			setIsPlaying(true)
		}
	}

	const toggleMute = () => {
		const nextMuted = !targetRef.current.muted
		targetRef.current.muted = nextMuted
		setIsMuted(nextMuted)
	}

	return (
		<>
			{/* Video */}
			<video
				ref={targetRef}
				src={shouldLoad ? src : undefined}
				autoPlay={autoPlay}
				// A poster attribute downloads immediately, so off-screen videos only
				// get theirs when they come near the viewport.
				poster={eager || hasEnteredView ? poster : undefined}
				loop
				muted={mute}
				playsInline
				preload={shouldLoad ? (autoPlay ? 'auto' : 'metadata') : 'none'}
				className={className}
				style={{ minWidth: '100%', minHeight: '100%', ...style }}
			/>

			{/* Video Controls */}
			{showControls && (
				<div className={styles.controls}>
					<button
						type='button'
						className={styles.playIcon}
						onClick={togglePlay}
						aria-label={isPlaying ? 'Pause video' : 'Play video'}
					>
						{isPlaying ? (
							<PauseCircleOutlineOutlinedIcon color='white' />
						) : (
							<PlayArrowOutlinedIcon color='white' />
						)}
					</button>

					<button
						type='button'
						className={styles.muteIcon}
						onClick={toggleMute}
						aria-label={isMuted ? 'Unmute video' : 'Mute video'}
					>
						{isMuted ? (
							<VolumeOffOutlinedIcon color='white' />
						) : (
							<VolumeUpOutlinedIcon color='white' />
						)}
					</button>
				</div>
			)}
		</>
	)
}

export default Video
