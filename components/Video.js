'use client'

// styles
import styles from './Banner.module.scss'

// components
import {
	IoPlaySharp,
	IoPauseSharp,
	IoVolumeMuteSharp,
	IoVolumeHighSharp
} from 'react-icons/io5'

// hooks
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useState } from 'react'

const Video = ({ video, showControls }) => {
	const options = {
		root: null,
		rootMargin: '0%',
		threshold: 0
	}

	const [targetRef, isIntersecting] = useIntersectionObserver(options)

	const [isPlaying, setIsPlaying] = useState(true)
	const [isMuted, setIsMuted] = useState(false)

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
			<video ref={targetRef} autoPlay loop muted playsInline preload='auto'>
				{isIntersecting && (
					<source src={'https:' + video.fields.file.url} type='video/mp4' />
				)}
			</video>

			{/* Video Controls */}
			{showControls && (
				<div className={styles.controls}>
					<div className={styles.playIcon} onClick={togglePlay}>
						{isPlaying ? (
							<IoPauseSharp color='white' size={26} />
						) : (
							<IoPlaySharp color='white' size={26} />
						)}
					</div>

					<div className={styles.muteIcon} onClick={toggleMute}>
						{isMuted ? (
							<IoVolumeMuteSharp color='white' size={26} />
						) : (
							<IoVolumeHighSharp color='white' size={26} />
						)}
					</div>
				</div>
			)}
		</>
	)
}

export default Video
