import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata = {
	title: 'Sign-in problem | Difinery',
	robots: { index: false, follow: false }
}

const MESSAGES = {
	'not-configured': 'Customer accounts are not switched on yet.',
	'missing-code': 'The sign-in link came back incomplete.',
	'state-mismatch':
		'The sign-in link expired or was opened in a different browser.',
	'token-exchange': 'We could not complete the sign-in with Shopify.',
	'access_denied': 'The sign-in was cancelled.'
}

export default async function AccountErrorPage({ searchParams }) {
	const params = await searchParams
	const reason = typeof params?.reason === 'string' ? params.reason : ''
	const message =
		MESSAGES[reason] || 'Something went wrong while signing you in.'

	return (
		<main className='container topSection' style={{ marginBottom: '10rem' }}>
			<h1>We couldn&apos;t sign you in</h1>
			<p style={{ marginTop: '1.5rem', maxWidth: '480px' }}>{message} Please
				try again — if it keeps happening, get in touch and we&apos;ll help.</p>

			<div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem' }}>
				<Link href='/api/account/login'>Try again</Link>
				<Link href='/customer-service'>Contact us</Link>
			</div>
		</main>
	)
}
