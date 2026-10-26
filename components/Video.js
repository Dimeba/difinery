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

const Video = ({
	video,
	showControls,
	autoPlay = false,
	mute = true,
	placeholder = null,
	style,
	className,
	// Above-the-fold videos (e.g. the hero) load straight away.
	eager = false
}) => {
	const [targetRef, isIntersecting] = useIntersectionObserver(OBSERVER_OPTIONS)

	// The file is only requested once the video has come near the viewport.
	const [hasEnteredView, setHasEnteredView] = useState(eager)
	const [isPlaying, setIsPlaying] = useState(autoPlay)
	const [isMuted, setIsMuted] = useState(mute)

	if (isIntersecting && !hasEnteredView) setHasEnteredView(true)

	// Pause off-screen videos and resume them when they come back, unless the
	// visitor paused them. Only pause after the video has actually been seen, so
	// an eager video isn't paused before the observer's first report.
	const hasBeenVisibleRef = useRef(false)
	useEffect(() => {
		const el = targetRef.current
		if (!el || !hasEnteredView) return
		if (isIntersecting) {
			hasBeenVisibleRef.current = true
			if (isPlaying) el.play().catch(() => {})
		} else if (hasBeenVisibleRef.current) {
			el.pause()
		}
	}, [isIntersecting, hasEnteredView, isPlaying, targetRef])

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
				src={hasEnteredView ? resolveMediaSrc(video) : undefined}
				autoPlay={autoPlay}
				poster={resolveMediaSrc(placeholder)}
				loop
				muted={mute}
				playsInline
				preload={hasEnteredView ? (autoPlay ? 'auto' : 'metadata') : 'none'}
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
