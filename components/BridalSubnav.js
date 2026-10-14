import Link from 'next/link'
import { BRIDAL_PAGES } from '@/lib/bridal'
import styles from './BridalSubnav.module.scss'

const BridalSubnav = ({ activeSlug }) => {
	return (
		<div className={`topSection ${styles.wrap}`}>
			<nav className={`container ${styles.nav}`} aria-label='Bridal'>
				{BRIDAL_PAGES.map(page => {
					const isActive = page.slug === activeSlug
					return (
						<Link
							key={page.slug}
							href={`/bridal/${page.slug}`}
							className={isActive ? styles.active : styles.link}
							aria-current={isActive ? 'page' : undefined}
						>
							{page.title}
						</Link>
					)
				})}
			</nav>
		</div>
	)
}

export default BridalSubnav
