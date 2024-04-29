'use client'

// styles
import styles from './Banner.module.scss'

// hooks
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useState } from 'react'

// components
import Button from './Button'
import Image from 'next/image'
import {
	IoPlaySharp,
	IoPauseSharp,
	IoVolumeMuteSharp,
	IoVolumeHighSharp
} from 'react-icons/io5'

const Banner = ({
	center,
	video,
	image,
	title,
	text,
	url,
	button1Text,
	button1Url,
	button2Text,
	button2Url,
	top,
	showControls
}) => {
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
		<section className={`${styles.banner} ${top ? styles.top : ''}`}>
			{video && (
				<video ref={targetRef} autoPlay loop muted playsInline preload='auto'>
					{isIntersecting && <source src={url} type='video/mp4' />}
				</video>
			)}

			{image && <Image src={url} alt='image' fill />}

			<div
				className={`container ${styles.content} ${center ? styles.center : ''}`}
			>
				{title && <h2>{title}</h2>}
				{text && <p>{text}</p>}
				{button1Text && (
					<div className={styles.buttons}>
						{button1Text && (
							<Button text={button1Text} link={button1Url} white />
						)}
						{button2Text && (
							<Button text={button2Text} link={button2Url} white />
						)}
					</div>
				)}

				{/* Video Controls */}
				{video && showControls && (
					<>
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
					</>
				)}
			</div>
		</section>
	)
}

export default Banner
