import { Libre_Franklin, Newsreader } from 'next/font/google'
import { Suspense } from 'react'
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

	return (
		<html lang='en'>
			<head>
				<link rel='icon' href='/favicon.svg' type='image/svg+xml' />
				{/* Meta Pixel Code */}
				<Script id='meta-pixel' strategy='afterInteractive'>
					{`!function(f,b,e,v,n,t,s)
					{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
					n.callMethod.apply(n,arguments):n.queue.push(arguments)};
					if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
					n.queue=[];t=b.createElement(e);t.async=!0;
					t.src=v;s=b.getElementsByTagName(e)[0];
					s.parentNode.insertBefore(t,s)}(window, document,'script',
					'https://connect.facebook.net/en_US/fbevents.js');
					fbq('init', '801044746115457');
					fbq('track', 'PageView');`}
				</Script>
				<noscript>
					<img
						height='1'
						width='1'
						style={{ display: 'none' }}
						src='https://www.facebook.com/tr?id=801044746115457&ev=PageView&noscript=1'
					/>
				</noscript>
				{/* End Meta Pixel Code */}
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
