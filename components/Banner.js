'use client'

// styles
import styles from './Banner.module.scss'

// hooks
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

// components
import Button from './Button'
import Image from 'next/image'

const Banner = ({
	center,
	video,
	image,
	url,
	button1Text,
	button1Url,
	button2Text,
	button2Url
}) => {
	const options = {
		root: null,
		rootMargin: '0%',
		threshold: 0
	}

	const [targetRef, isIntersecting] = useIntersectionObserver(options)

	return (
		<section className={styles.banner}>
			{video && (
				<video ref={targetRef} autoPlay loop muted playsInline preload='auto'>
					{isIntersecting && <source src={url} type='video/mp4' />}
				</video>
			)}

			{image && <Image src={url} alt='image' fill />}

			<div
				className={`container ${styles.content} ${center ? styles.center : ''}`}
			>
				<h2>Find timeless elegance in every piece.</h2>
				<p>
					Sustainable and ethically-crafted fine jewelry is our essence. We are
					committed to fair value and a fair future. To us, forever is not just
					about every piece of jewelry lasting forever, but contributing to a
					forever future for our planet, and its people.
				</p>
				<div className={styles.buttons}>
					{button1Text && <Button text={button1Text} link={button1Url} white />}
					{button2Text && <Button text={button2Text} link={button2Url} white />}
				</div>
			</div>
		</section>
	)
}

export default Banner
