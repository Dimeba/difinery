// styles
import styles from './Materials.module.scss'

const Materials = () => {
	const materials = [
		{
			number: '100%',
			text: 'of diamonds sourced are guaranteed conflict-free, ensuring ethical practices throughout the supply chain.'
		},
		{
			number: '95%',
			text: 'of packaging materials are made from recycled and recyclable materials.'
		},
		{
			number: '95%',
			text: 'less carbon emissions compared to mined diamonds.'
		},
		{
			number: '70%',
			text: 'less water is used compared to traditional diamond mining.'
		},
		{
			number: '50%',
			text: 'of the company’s energy consumption comes from renewable sources.'
		},
		{
			number: '30%',
			text: 'reduction in waste generation, with a focus on recycling and responsible disposal methods.'
		},
		{
			number: '30%',
			text: 'reduction in waste generation, with a focus on recycling and responsible disposal methods.'
		},
		{
			number: '30%',
			text: 'reduction in waste generation, with a focus on recycling and responsible disposal methods.'
		}
	]

	return (
		<section>
			<div className={`container ${styles.materials}`}>
				<h3>
					Handcrafted in the Diamond District with 100% recycled gold and
					sustainably created diamonds
				</h3>

				<div className={styles.content}>
					{materials.map((material, index) => (
						<div key={index} className={styles.column}>
							<h2>{material.number}</h2>
							<p>{material.text}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

export default Materials
