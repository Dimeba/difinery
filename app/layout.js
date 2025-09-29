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
import GTMEvents from '@/components/GTMEvents'

const header = await getEntries('header')
const footer = await getEntries('footer')
const collections = await getEntries('collection')

export const metadata = {
	icons: {
		icon: '/favicon.svg'
	},
	verification: {
		google: 'R6Dbld100s-Hn6MF_tTVmwZzsYVaexTKMUynnJl4vCg'
	}
}

export default function RootLayout({ children }) {
	// Header
	const headerContent = header.items[0].fields
	const footerContent = footer.items[0].fields
	const collectionsContent = collections.items

	const GTM_ID = process.env.gtmId

	return (
		<html lang='en'>
			<head>
				<link rel='icon' href='/favicon.svg' type='image/svg+xml' />
				{/* Google Tag Manager */}
				<Script id='gtm-init' strategy='afterInteractive'>
					{`// Pre-initialize dataLayer and optional default consent (adjust as needed)
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					// Example Consent Mode defaults (comment out if not using):
					// gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'granted' });
					(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
					new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
					j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
					'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
					})(window,document,'script','dataLayer','${GTM_ID}');`}
				</Script>
				{/* End Google Tag Manager */}
			</head>
			<ApolloContext>
				<CartProvider>
					<body
						className={`${libreFranklin.className} ${newsreader.className}`}
					>
						{/* Google Tag Manager (noscript) */}
						<noscript>
							<iframe
								src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
								height='0'
								width='0'
								style={{ display: 'none', visibility: 'hidden' }}
							></iframe>
						</noscript>
						<GTMEvents />
						{/* End Google Tag Manager (noscript) */}
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
