// styles
import styles from './Ubs.module.scss'

// components
import Button from '../Button'

const UbsIntro = () => {
	return (
		<section>
			<div className={`container ${styles.centered}`}>
				<h1>The Difinery Program for UBS Staff</h1>
				<p className={styles.lead}>
					A private benefit extended exclusively to UBS staff: ten percent off
					every piece in our collection, plus a fine jewelry repair service we
					do not offer to the public.
				</p>

				<div className={styles.buttonWide}>
					<Button text='Shop with Your Discount' fullWidth />
				</div>

				<p className={styles.note}>
					Your UBS discount is applied automatically at checkout.
					<br />
					No code required.
				</p>
			</div>
		</section>
	)
}

export default UbsIntro
