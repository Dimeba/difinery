import Link from 'next/link'
import { notFound } from 'next/navigation'

import { customerFetch } from '@/lib/customerAccount/client'
import { CUSTOMER_ORDER } from '@/lib/customerAccount/queries'
import {
	addressLines,
	formatDate,
	formatMoney,
	formatStatus
} from '@/lib/customerAccount/format'

import ReturnRequestForm from './ReturnRequestForm'
import styles from '../../Account.module.scss'

export const dynamic = 'force-dynamic'

export default async function OrderDetailPage({ params }) {
	const { id } = await params
	const orderId = decodeURIComponent(id)

	const data = await customerFetch(CUSTOMER_ORDER, { id: orderId })
	const order = data?.customer?.order

	if (!order) notFound()

	const lineItems = order.lineItems?.nodes || []
	const fulfillments = order.fulfillments?.nodes || []
	const returnable = order.returnInformation?.returnableLineItems?.nodes || []

	const tracking = fulfillments
		.flatMap(f => f.trackingInformation || [])
		.filter(t => t?.number)

	return (
		<>
			<Link href='/account/orders' className={styles.backLink}>
				← All orders
			</Link>

			<h1 className={styles.pageTitle}>{order.name}</h1>
			<p className={styles.pageIntro}>
				Placed {formatDate(order.processedAt)} ·{' '}
				{formatStatus(order.financialStatus)}
			</p>

			<div className={styles.orderDetailGrid}>
				<div>
					<div className={styles.list}>
						{lineItems.map(item => (
							<div key={item.id} className={styles.listRow}>
								<span className={styles.listRowMain}>
									{item.image?.url && (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={item.image.url}
											alt={item.image.altText || item.title}
											className={styles.thumb}
										/>
									)}
									<span>
										<span className={styles.orderName}>{item.title}</span>
										{item.variantTitle && (
											<>
												<br />
												<span className={styles.muted}>{item.variantTitle}</span>
											</>
										)}
										{item.customAttributes
											?.filter(attr => attr.value)
											.map(attr => (
												<span key={attr.key}>
													<br />
													<span className={styles.muted}>
														{attr.key}: {attr.value}
													</span>
												</span>
											))}
										<br />
										<span className={styles.muted}>Qty {item.quantity}</span>
									</span>
								</span>
								<span>{formatMoney(item.totalPrice)}</span>
							</div>
						))}
					</div>

					{returnable.length > 0 && (
						<ReturnRequestForm orderId={order.id} items={returnable} />
					)}
				</div>

				<aside>
					<h2 className={styles.sectionTitle} style={{ marginTop: 0 }}>
						Summary
					</h2>
					<div className={styles.totalsRow}>
						<span>Subtotal</span>
						<span>{formatMoney(order.subtotal)}</span>
					</div>
					<div className={styles.totalsRow}>
						<span>Shipping</span>
						<span>{formatMoney(order.totalShipping)}</span>
					</div>
					<div className={styles.totalsRow}>
						<span>Tax</span>
						<span>{formatMoney(order.totalTax)}</span>
					</div>
					<div className={`${styles.totalsRow} ${styles.totalsRowStrong}`}>
						<span>Total</span>
						<span>{formatMoney(order.totalPrice)}</span>
					</div>

					{order.shippingAddress && (
						<>
							<h2 className={styles.sectionTitle}>Shipping to</h2>
							<p className={styles.addressLines}>
								{addressLines(order.shippingAddress)}
							</p>
						</>
					)}

					{tracking.length > 0 && (
						<>
							<h2 className={styles.sectionTitle}>Tracking</h2>
							{tracking.map((item, index) => (
								<p key={index} className={styles.muted}>
									{item.company ? `${item.company} · ` : ''}
									{item.url ? (
										<a href={item.url} target='_blank' rel='noreferrer'>
											{item.number}
										</a>
									) : (
										item.number
									)}
								</p>
							))}
						</>
					)}

					{order.statusPageUrl && (
						<div className={styles.formActions}>
							<a
								href={order.statusPageUrl}
								target='_blank'
								rel='noreferrer'
								className={styles.buttonSubtle}
							>
								Order status page
							</a>
						</div>
					)}
				</aside>
			</div>
		</>
	)
}
