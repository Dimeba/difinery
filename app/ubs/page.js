// components
import UbsHero from '@/components/ubs/UbsHero'
import UbsIntro from '@/components/ubs/UbsIntro'
import UbsBenefits from '@/components/ubs/UbsBenefits'
import UbsActivate from '@/components/ubs/UbsActivate'
import UbsSplit from '@/components/ubs/UbsSplit'
import UbsFAQ from '@/components/ubs/UbsFAQ'
import UbsCta from '@/components/ubs/UbsCta'
import Button from '@/components/Button'
import Link from 'next/link'

// styles
import styles from '@/components/ubs/Ubs.module.scss'

export const metadata = {
	title: 'Difinery | The Difinery Program for UBS Staff',
	description:
		'A private benefit extended exclusively to UBS staff: ten percent off every piece in our collection, plus a fine jewelry repair service we do not offer to the public.',
	robots: { index: false, follow: false }
}

export default function UbsPage() {
	return (
		<main>
			<UbsHero />
			<UbsIntro />
			<UbsBenefits />
			<UbsActivate />

			<section className={styles.splitSection}>
				<UbsSplit
					image='/ubs/repair-banner.jpg'
					imageAlt='Our New York bench repairing a piece of jewelry'
				>
					<h2>Repair Service, Exclusively for UBS</h2>
					<p>
						This is the one benefit we extend to no one else. If a piece you own
						needs work, from a loose stone to a worn prong to a clasp that no
						longer closes, our New York bench will look at it. Pieces purchased
						from Difinery and pieces from other jewelers are both welcome.
					</p>

					<h4 className={styles.splitSubtitle}>How it works</h4>
					<ul className={styles.list}>
						<li>
							<p>
								Email{' '}
								<a href='mailto:help@difinery.com' className={styles.inlineLink}>
									help@difinery.com
								</a>{' '}
								from your UBS email address with &ldquo;UBS&rdquo; in the
								subject line.
							</p>
						</li>
						<li>
							<p>Include a short description and a photo of the piece.</p>
						</li>
						<li>
							<p>
								We will respond within two business days with an assessment and
								next steps.
							</p>
						</li>
					</ul>

					<Button
						text='Request a Repair'
						link='mailto:help@difinery.com?subject=UBS'
						red
						fullWidth
					/>
				</UbsSplit>

				<UbsSplit
					image='/ubs/custom-product-banner.jpg'
					imageAlt='Difinery ring handcrafted in recycled gold with lab grown diamonds'
					reverse
				>
					<h2>Special Orders & Custom Designs</h2>
					<p>
						Whether you&apos;ve discovered a piece in our shop that
						you&apos;d like to make your own or have an entirely new design
						in mind, Difinery welcomes special orders and custom jewelry
						requests. From thoughtful modifications to one-of-a-kind
						creations, our team can help bring your vision to life with the
						same attention to detail and craftsmanship found in every
						Difinery piece.
					</p>
					<p>Email us to share your idea, and we&apos;ll be in touch.</p>

					<Button
						text='Start a Custom Order'
						link={`mailto:help@difinery.com?subject=${encodeURIComponent(
							'Special Orders & Custom Designs'
						)}`}
						red
						fullWidth
					/>
				</UbsSplit>

				<UbsSplit
					image='/ubs/why-difinery-banner.jpg'
					imageAlt='Difinery necklace styled with a tailored blazer'
				>
					<h2>Fine Jewelry, Made Responsibly in New York</h2>
					<p>
						Every Difinery piece is handcrafted in New York City from certified
						100% recycled 14K solid gold and lab grown diamonds. Each piece is
						made to order, so nothing sits in a vault and nothing is produced
						that has not been asked for. We are a women led company, and our
						pricing is transparent every day of the year. No inflated list
						prices, no manufactured sales.
					</p>

					<div className={styles.links}>
						<Link href='/lab-grown-diamonds'>
							<h4>Lab Grown Diamonds</h4>
						</Link>
						<Link href='/14k-certified-recycled-solid-gold'>
							<h4>14K Certified Recycled Gold</h4>
						</Link>
						<Link href='/our-story'>
							<h4>Our Story</h4>
						</Link>
					</div>
				</UbsSplit>
			</section>

			<UbsFAQ />
			<UbsCta />
		</main>
	)
}
