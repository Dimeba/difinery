// styles
import styles from './NeedHelpInfo.module.scss'

const NeedHelpInfo = ({ type }) => {
	switch (type) {
		case 'ring size':
			return (
				<div className={styles.container}>
					<p>
						A well-fitted ring should slide smoothly over your knuckle and feel
						snug enough to stay in place without causing discomfort. It
						shouldn't be too tight or too loose. If the ring spins easily, it's
						likely too big. If it feels tight or leaves a mark, it might be too
						small.
					</p>

					<p style={{ fontWeight: '700', marginTop: '1rem' }}>
						How to Find Your Ring Size at Home
					</p>
					<p>
						The easiest way to measure your ring size at home is using a strip
						of paper or a piece of string:
					</p>

					<ul style={{ marginTop: '1rem' }}>
						<li>1. Wrap the paper or string around the base of your finger.</li>
						<li>2. Mark where the ends meet.</li>
						<li>
							3. Measure the length of the paper or string in millimeters (mm).
						</li>
						<li>4. Use our below to find your ring size.</li>
					</ul>

					<p>
						For the best results, measure at the end of the day when your
						fingers are usually at their largest. Avoid measuring when your
						fingers are cold, as they may be smaller than usual.
					</p>

					<p style={{ fontWeight: '700', marginTop: '1rem' }}>
						Resources for Accurate Sizing
					</p>
					<p>
						Resources for Accurate Sizing To help with accuracy, we recommend
						using a printable ring size guide, which can be downloaded{' '}
						<a href='#'>here</a>
					</p>
				</div>
			)

		case 'carat':
			return <div className={styles.container}>???</div>

		default:
			return <></>
	}
}

export default NeedHelpInfo
