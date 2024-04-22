// styles
import styles from './FAQ.module.scss'

// components
import Accordion from './Accordion'

const FAQ = () => {
	return (
		<section>
			<div className={`container ${styles.faq}`}>
				<h3>Frequently Asked Questions</h3>

				<div className={styles.accordion}>
					<Accordion title='Product Details'>
						<p>
							Experience incomparable grace with our Fleur Ring - a delicate
							statement piece of jewelry that captures the essence of spring in
							every hand movement. The ring, made of 14k recycled gold, proudly
							presents our Fleur design, which weighs 0.08ct. is adorned with
							lab grown brilliant-cut diamonds. These sparkling diamonds bring
							the finely crafted ring to life and give it everlasting beauty.
							Whether as a symbol of love, as a fashion accessory or as a
							reminder of special moments - our Fleur ring is always the perfect
							choice.
						</p>
					</Accordion>
					<Accordion title='Shipping Details'>
						{' '}
						<p>
							Experience incomparable grace with our Fleur Ring - a delicate
							statement piece of jewelry that captures the essence of spring in
							every hand movement. The ring, made of 14k recycled gold, proudly
							presents our Fleur design, which weighs 0.08ct. is adorned with
							lab grown brilliant-cut diamonds. These sparkling diamonds bring
							the finely crafted ring to life and give it everlasting beauty.
							Whether as a symbol of love, as a fashion accessory or as a
							reminder of special moments - our Fleur ring is always the perfect
							choice.
						</p>
					</Accordion>
					<Accordion title='Financing'>
						{' '}
						<p>
							Experience incomparable grace with our Fleur Ring - a delicate
							statement piece of jewelry that captures the essence of spring in
							every hand movement. The ring, made of 14k recycled gold, proudly
							presents our Fleur design, which weighs 0.08ct. is adorned with
							lab grown brilliant-cut diamonds. These sparkling diamonds bring
							the finely crafted ring to life and give it everlasting beauty.
							Whether as a symbol of love, as a fashion accessory or as a
							reminder of special moments - our Fleur ring is always the perfect
							choice.
						</p>
					</Accordion>
					<Accordion title='Handcrafted in The Diamon District'>
						{' '}
						<p>
							Experience incomparable grace with our Fleur Ring - a delicate
							statement piece of jewelry that captures the essence of spring in
							every hand movement. The ring, made of 14k recycled gold, proudly
							presents our Fleur design, which weighs 0.08ct. is adorned with
							lab grown brilliant-cut diamonds. These sparkling diamonds bring
							the finely crafted ring to life and give it everlasting beauty.
							Whether as a symbol of love, as a fashion accessory or as a
							reminder of special moments - our Fleur ring is always the perfect
							choice.
						</p>
					</Accordion>
				</div>
			</div>
		</section>
	)
}

export default FAQ
