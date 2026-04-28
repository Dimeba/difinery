'use client'

import Link from 'next/link'
import Image from 'next/image'

import styles from './Header.module.scss'

const HeaderSubmenu = ({ columns = [], promotions = [], promoOverrides = [] }) => {
	const promoItems =
		Array.isArray(promoOverrides) && promoOverrides.length > 0
			? promoOverrides.map((promo, index) => ({
					id: promo.id || `custom-promo-${index}`,
					title: promo.title || '',
					link: promo.link || '/',
					imageUrl: promo.imageUrl || ''
				}))
			: (promotions || []).map(promo => ({
					id: promo?.sys?.id,
					title: promo?.fields?.title || '',
					link: promo?.fields?.link || '/',
					imageUrl: promo?.fields?.image?.fields?.file?.url
						? `https:${promo.fields.image.fields.file.url}`
						: ''
				}))

	return (
		<div className={`container ${styles.subMenu}`}>
			{columns.map((column, index) => {
				if (column.title === 'none') {
					return <div className={styles.column2} key={`empty-${index}`} />
				}

				return (
					<div className={styles.column2} key={`${column.title}-${index}`}>
						<p style={{ fontWeight: '600' }}>{column.title}</p>
						{(column.rows || []).map(row => (
							<Link
								key={`${row.title}-${row.url}`}
								href={row.url}
								aria-label={`Link to ${row.title} page.`}
								className={styles.subMenuLink}
							>
								<p>{row.title}</p>
							</Link>
						))}
					</div>
				)
			})}

			{promoItems.map(item => (
				<div key={item.id} className={styles.column3}>
					<Link href={item.link} aria-label={`Link to ${item.title}`}>
						<div className={styles.subMenuImg}>
							{item.imageUrl && (
								<Image
									src={item.imageUrl}
									style={{ objectFit: 'cover' }}
									alt={item.title || 'Submenu promotion image'}
									fill
									sizes='(max-width: 1024px) 100vw, 25vw'
								/>
							)}
						</div>
					</Link>

					<p className={styles.promoTitle}>{item.title}</p>
				</div>
			))}
		</div>
	)
}

export default HeaderSubmenu
