import { Libre_Franklin, Newsreader } from 'next/font/google'
import { Suspense } from 'react'
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
import { AuthProvider } from '@/context/AuthContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { ApolloContext } from '@/lib/apolloContext'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import MUIProviders from '@/components/MUIProviders'
import LayoutClientEffects from '@/components/LayoutClientEffects'
import DeferredAnalytics from '@/components/DeferredAnalytics'

const header = await getEntries('header')
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
	const collectionsContent = collections.items

	const GTM_ID = process.env.gtmId

	return (
		<html lang='en' data-scroll-behavior='smooth'>
			<head>
				{/* GTM, Meta Pixel, Clarity and Klaviyo load on first interaction: see DeferredAnalytics */}
				{/* Meta Pixel (noscript) */}
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
				<AuthProvider>
					<WishlistProvider>
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
								<DeferredAnalytics
									gtmId={GTM_ID}
									metaPixelId='2150880189011679'
									clarityId='wbs880tbvi'
									klaviyoCompanyId='SV87h3'
								/>
								{/* End Google Tag Manager (noscript) */}
								<AppRouterCacheProvider>
									<MUIProviders>
										<Cart />
										<Header
											content={headerContent}
											collectionsContent={collectionsContent}
										/>
										{children}
										<Footer />
									</MUIProviders>
								</AppRouterCacheProvider>
							</body>
						</CartProvider>
					</WishlistProvider>
				</AuthProvider>
			</ApolloContext>
		</html>
	)
}
