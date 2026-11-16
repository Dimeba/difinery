// components
import UbsRaffle from '@/components/ubs/UbsRaffle'

export const metadata = {
	title: 'Difinery | UBS Staff Exclusive: Enter to Win $500',
	description:
		'UBS staff exclusive: enter to win $500 in fine jewelry from Difinery, plus your 10% UBS discount on top.',
	robots: { index: false, follow: false }
}

export default function UbsRafflePage() {
	return (
		<main>
			<UbsRaffle />
		</main>
	)
}
