// styles
import styles from './Ubs.module.scss'

// components
import Placeholder from './Placeholder'

const benefits = [
	{
		title: ['10% Off', 'Everything'],
		text: 'Every piece, every day of the year. Engagement rings, custom designs, and full price collection pieces included. No minimum order and no expiration date.'
	},
	{
		title: ['Complimentary', 'Care'],
		text: 'One full year of professional polishing and cleaning with every Difinery purchase, on the house. Bring it back whenever it needs attention and we will return it looking the way it did the day it arrived.'
	},
	{
		title: ['Fine Jewelry', 'Repair Service'],
		text: 'Reserved for UBS staff only. Our New York bench will assess and repair fine jewelry you already own, whether or not it came from Difinery. This service is not available to the general public.'
	}
]

const UbsBenefits = () => {
	return (
		<section>
			<div className={`container ${styles.benefits}`}>
				{benefits.map(benefit => (
					<div key={benefit.title.join(' ')} className={styles.benefit}>
						<Placeholder label='Icon' className={styles.icon} />
						<h4>
							{benefit.title[0]}
							<br />
							{benefit.title[1]}
						</h4>
						<p>{benefit.text}</p>
					</div>
				))}
			</div>
		</section>
	)
}

export default UbsBenefits
