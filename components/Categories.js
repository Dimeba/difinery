// styles
import styles from './Categories.module.scss'

// components
import Image from 'next/image'
import Link from 'next/link'

const Categories = () => {
	const categories = ['bracellets', 'earrings', 'rings', 'pendants']

	return (
		<section>
			<div className={`container ${styles.content}`}>
				<h3>Shop by Category</h3>

				<div className={styles.categories}>
					{categories.map((item, index) => (
						<div key={index} className={styles.categorie}>
							<Link href='#' aria-label={`Link to ${item} page.`}>
								<div className={styles.image}>
									<Image
										src={`/${item}.jpg`}
										fill
										alt='Category Image.'
										style={{ objectFit: 'cover' }}
									/>
								</div>
							</Link>
							<h4>{item}</h4>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

export default Categories
