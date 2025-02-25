export const metadata = {
	title: 'Difinery'
}

// components
import Image from 'next/image'
import Link from 'next/link'
import CommingSoonVideo from '@/components/CommingSoonVideo'

// sm
import {
	FaInstagram,
	FaTiktok,
	FaPinterest
	// FaYoutube,
	// FaEtsy
} from 'react-icons/fa'

export default async function Home() {
	const socials = [
		{
			url: 'https://www.tiktok.com/@difinery/',
			icon: <FaTiktok size={20} />
		},
		{
			url: 'https://www.instagram.com/difinery/',
			icon: <FaInstagram size={20} />
		},
		{
			url: 'https://www.pinterest.com/difinery/',
			icon: <FaPinterest size={20} />
		}
	]

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
					padding: '2rem',
					gap: '1rem',
					zIndex: 2
				}}
			>
				{socials.map((social, index) => (
					<a
						key={index}
						href={social.url}
						target='_blank'
						rel='noreferrer'
						aria-label='Social media link'
					>
						{social.icon}
					</a>
				))}
			</div>

			<CommingSoonVideo />
		</main>
	)
}
