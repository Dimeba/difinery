export const metadata = {
	title: 'Difinery'
}

// components
import Image from 'next/image'
import CommingSoonVideo from '@/components/CommingSoonVideo'

export default async function Home() {
	return (
		<main
			style={{
				overflow: 'hidden',
				height: '100vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<div
				style={{
					position: 'fixed',
					top: 0,
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					padding: '2rem'
				}}
			>
				<Image
					src='/logo-tm.svg'
					alt='Difinery logo'
					width={160}
					height={160 / 7.17}
					style={{ objectFit: 'contain', objectPosition: 'center' }}
				/>
			</div>

			<div
				style={{
					position: 'fixed',
					bottom: 0,
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					padding: '2rem'
				}}
			>
				<p style={{ fontSize: '1.5rem' }}>COMMING SOON</p>
			</div>

			<CommingSoonVideo />
		</main>
	)
}
