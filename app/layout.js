import { Libre_Franklin, Newsreader } from 'next/font/google'
import Script from 'next/script'
import './globals.scss'

const libreFranklin = Libre_Franklin({ subsets: ['latin'] })
const newsreader = Newsreader({ subsets: ['latin'] })

// components
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Cart from '@/components/Cart'

// lib
import { getEntries } from '@/lib/contentful'

// context
import { CartProvider } from '@/context/CartContext'
import { ApolloContext } from '@/lib/apolloContext'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import MUIProviders from '@/components/MUIProviders'

const header = await getEntries('header')
const footer = await getEntries('footer')
const collections = await getEntries('collection')

export const metadata = {
	icons: {
		icon: '/favicon.svg'
	}
}

export default function RootLayout({ children }) {
	// Header
	const headerContent = header.items[0].fields
	const footerContent = footer.items[0].fields
	const collectionsContent = collections.items

	const GA_ID = process.env.googleAnalytics

	return (
		<html lang='en'>
			<head>
				<link rel='icon' href='/favicon.svg' type='image/svg+xml' />

				{GA_ID && (
					<>
						<Script
							src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
							strategy='afterInteractive'
						/>
						<Script id='google-analytics' strategy='afterInteractive'>
							{`
            				window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);}
            				gtag('js', new Date());
            				gtag('config', '${GA_ID}', {
              				page_path: window.location.pathname,
            				});
          				`}
						</Script>
					</>
				)}
			</head>
			<ApolloContext>
				<CartProvider>
					<body
						className={`${libreFranklin.className} ${newsreader.className}`}
					>
						<AppRouterCacheProvider>
							<MUIProviders>
								<Cart />
								<Header
									content={headerContent}
									collectionsContent={collectionsContent}
								/>
								{children}
								<Footer content={footerContent} />
							</MUIProviders>
						</AppRouterCacheProvider>
					</body>
				</CartProvider>
			</ApolloContext>
		</html>
	)
}
