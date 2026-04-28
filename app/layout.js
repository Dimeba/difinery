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
import LayoutClientEffects from '@/components/LayoutClientEffects'

const header = await getEntries('header')
const footer = await getEntries('footer')
const collections = await getEntries('collection')

export const metadata = {
	title: 'Difinery | Fine Jewelry',
	description: 'Discover timeless fine jewelry crafted with care',
	icons: {
		icon: [
			{ url: '/favicon.svg', type: 'image/svg+xml' },
			{ url: '/favicon.ico', sizes: '32x32' }
		],
		shortcut: '/favicon.svg',
		apple: '/favicon.svg'
	},
	verification: {
		google: 'R6Dbld100s-Hn6MF_tTVmwZzsYVaexTKMUynnJl4vCg'
	},
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_SITE_URL || 'https://difinery.com'
	)
}

export default function RootLayout({ children }) {
	// Header
	const headerContent = header.items[0].fields
	const footerContent = footer.items[0].fields
	const collectionsContent = collections.items

	const GTM_ID = process.env.gtmId

	return (
		<html lang='en' data-scroll-behavior='smooth'>
			<head>
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
					fbq('init', '2150880189011679');
					fbq('track', 'PageView');`}
				</Script>
				{/* Klaviyo Onsite */}
				<Script
					id='klaviyo-onsite'
					src='https://static.klaviyo.com/onsite/js/SV87h3/klaviyo.js?company_id=SV87h3'
					strategy='afterInteractive'
					async
				/>
				{/* Microsoft Clarity */}
				<Script id='microsoft-clarity' strategy='afterInteractive'>
					{`(function(c,l,a,r,i,t,y){
						c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
						t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
						y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
					})(window,document,"clarity","script","wbs880tbvi");`}
				</Script>
				{/* End Klaviyo Onsite */}
				<noscript>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						height='1'
						width='1'
						alt=''
						style={{ display: 'none' }}
						src='https://www.facebook.com/tr?id=2150880189011679&ev=PageView&noscript=1'
					/>
				</noscript>
				{/* End Meta Pixel Code */}
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
						<Suspense fallback={null}>
							<LayoutClientEffects />
						</Suspense>
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
