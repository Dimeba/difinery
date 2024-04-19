// styles
import styles from './Categories.module.scss'

// components
import Image from 'next/image'
import Link from 'next/link'

const Categories = ({ categories }) => {
	console.log(categories[0].assets[0].url)

	return (
		<section>
			<div className={`container ${styles.content}`}>
				<h3>Shop by Category</h3>

				<div className={styles.categories}>
					{categories.map(item => (
						<div key={item.id} className={styles.categorie}>
							<Link href='#' aria-label={`Link to ${item.name} page.`}>
								<div className={styles.image}>
									<Image
										src={item.assets[0].url}
										fill
										alt='Category Image.'
										style={{ objectFit: 'cover' }}
									/>
								</div>
							</Link>
							<h4>{item.name}</h4>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

export default Categories
