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

const Video = ({ video, showControls, autoPlay = false, mute = true }) => {
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
				loop
				muted={mute}
				playsInline
				preload='auto'
				style={{ width: '100%' }}
			>
				{isIntersecting && (
					<source src={'https:' + video.fields.file.url} type='video/mp4' />
				)}
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
