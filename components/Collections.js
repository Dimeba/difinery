// styles
import styles from './Collections.module.scss'

// components
import Image from 'next/image'
import Link from 'next/link'

const Collections = () => {
	const collections = [
		{
			title: `Valentine's`,
			image: '/sample-image.jpg'
		},
		{
			title: 'Engagement',
			image: '/sample-image1.jpg'
		},
		{
			title: `Mothers's day`,
			image: '/sample-image2.jpg'
		}
	]

	return (
		<section>
			<div className={`container ${styles.collectionsContainer}`}>
				<h3>Explore Our Collections</h3>
				<div className={styles.collections}>
					{collections.map((collection, index) => (
						<div key={index} className={styles.collection}>
							<Link href='#' aria-label='Link to collection'>
								<div className={styles.image}>
									<Image
										src={collection.image}
										fill
										style={{ objectFit: 'cover' }}
										alt='Collection Preview Image'
									/>
								</div>
							</Link>
							<h5>{collection.title}</h5>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

export default Collections
