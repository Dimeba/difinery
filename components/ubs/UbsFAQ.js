// styles
import styles from './Ubs.module.scss'

// components
import Accordion from '../Accordion'

const email = <a href='mailto:help@difinery.com'>help@difinery.com</a>

const faqs = [
	{
		question: 'Does the discount apply to engagement rings?',
		answer:
			'Yes. The ten percent discount applies to every piece we sell, including engagement rings and custom commissions, with no exceptions.'
	},
	{
		question: 'Can I combine this with another promotion?',
		answer:
			'There is nothing to combine it with. Difinery does not run flash sales, Black Friday events, or seasonal markdowns. Our pieces are priced fairly every day of the year, and we earn our clients through the quality of our work and the honesty of our pricing, not through countdown timers. Preferred pricing is reserved for partnerships and collaborations such as this one, which is what makes the UBS program meaningful.'
	},
	{
		question: 'How is my eligibility verified?',
		answer:
			'Through your UBS email address. Please use your company email when confirming eligibility and when contacting us about repairs.'
	},
	{
		question: 'I own a Difinery piece that needs attention. What should I do?',
		answer: (
			<>
				Email {email} from your UBS email address and include &ldquo;UBS&rdquo;
				in the subject line. We will take it from there.
			</>
		)
	},
	{
		question: 'Will you repair jewelry I did not purchase from Difinery?',
		answer:
			'Yes. The repair service is a benefit reserved for UBS staff and covers fine jewelry from any source. We will assess each piece individually and let you know what is possible before any work begins.'
	},
	{
		question: 'Is there a cost for repairs?',
		answer:
			'Assessments are complimentary. If a repair requires materials such as replacement stones or additional gold, we will provide a written quote before proceeding. Your ten percent discount applies to any quoted cost.'
	},
	{
		question: 'Does this benefit extend to family members?',
		answer:
			'The program is intended for UBS staff. Purchases are made through the staff member’s own verified account.'
	},
	{
		question: 'Who do I contact with questions?',
		answer: (
			<>
				Our client services team at {email}. Please include &ldquo;UBS&rdquo; in
				the subject line so your message is routed to the right person.
			</>
		)
	}
]

const UbsFAQ = () => {
	return (
		<section>
			<div className={`container ${styles.faq}`}>
				<h2>FAQ</h2>

				<div>
					{faqs.map(faq => (
						<Accordion
							key={faq.question}
							title={faq.question}
							small
							extraClass={styles.faqItem}
						>
							<p>{faq.answer}</p>
						</Accordion>
					))}
				</div>
			</div>
		</section>
	)
}

export default UbsFAQ
