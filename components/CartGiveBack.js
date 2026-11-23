'use client'

// styles
import styles from './Cart.module.scss'

// lib
import { GIVE_BACK_CHARITIES } from '@/lib/giveBack'

// "Your 1% goes to" picker in the cart. Native radios keep arrow-key
// navigation; the labels are styled as chips. Hidden until partners are set
// in lib/giveBack.js.
const CartGiveBack = ({ value, onChange }) => {
	if (!GIVE_BACK_CHARITIES.length) return null

	return (
		<fieldset className={styles.giveBack}>
			<legend>Your 1% goes to</legend>

			<div className={styles.giveBackOptions}>
				{GIVE_BACK_CHARITIES.map(name => (
					<label key={name} className={styles.giveBackOption}>
						<input
							type='radio'
							name='give-back'
							value={name}
							checked={name === value}
							onChange={() => onChange(name)}
						/>
						{name}
					</label>
				))}
			</div>

			<p className={styles.giveBackNote}>
				We&apos;re a 1% for the Planet member: 1% of every sale goes to the
				organization you pick, so this purchase gives back too.
			</p>
		</fieldset>
	)
}

export default CartGiveBack
