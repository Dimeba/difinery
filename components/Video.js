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
import { useState } from 'react'

const Video = ({
	video,
	showControls,
	autoPlay = false,
	mute = true,
	placeholder = null,
	style
}) => {
	const resolveMediaSrc = media => {
		if (!media) return undefined
		if (typeof media === 'string') return media
		return 'https:' + media.fields.file.url
	}

	const options = {
		root: null,
		rootMargin: '0%',
		threshold: 0
	}

	const [targetRef, isIntersecting] = useIntersectionObserver(options)

	const [isPlaying, setIsPlaying] = useState(autoPlay)
	const [isMuted, setIsMuted] = useState(mute)

	const togglePlay = () => {
		if (isPlaying) {
			targetRef.current.pause()
			setIsPlaying(false)
		} else {
			targetRef.current.play()
			setIsPlaying(true)
		}
	}

	const toggleMute = () => {
		targetRef.current.muted = !targetRef.current.muted
		setIsMuted(!targetRef.current.muted)
	}

	return (
		<>
			{/* Video */}
			<video
				ref={targetRef}
				autoPlay={autoPlay}
				poster={resolveMediaSrc(placeholder)}
				loop
				muted={mute}
				playsInline
				preload='auto'
				style={{ minWidth: '100%', minHeight: '100%', ...style }}
			>
				<source src={resolveMediaSrc(video)} type='video/mp4' />
			</video>

			{/* Video Controls */}
			{showControls && (
				<div className={styles.controls}>
					<div className={styles.playIcon} onClick={togglePlay}>
						{isPlaying ? (
							<PauseCircleOutlineOutlinedIcon color='white' />
						) : (
							<PlayArrowOutlinedIcon color='white' />
						)}
					</div>

					<div className={styles.muteIcon} onClick={toggleMute}>
						{isMuted ? (
							<VolumeOffOutlinedIcon color='white' />
						) : (
							<VolumeUpOutlinedIcon color='white' />
						)}
					</div>
				</div>
			)}
		</>
	)
}

export default Video
