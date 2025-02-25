// import { Work_Sans } from 'next/font/google'
import { Libre_Franklin } from 'next/font/google'
import './globals.scss'

// const workSans = Work_Sans({ subsets: ['latin'] })
const libreFranklin = Libre_Franklin({ subsets: ['latin'] })

export const metadata = {
	icons: {
		icon: '/favicon.svg'
	}
}

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<head>
				<link rel='icon' href='/favicon.svg' type='image/svg+xml' />
			</head>
			<body className={libreFranklin.className}>{children}</body>
		</html>
	)
}
