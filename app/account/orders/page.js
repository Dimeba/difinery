import Link from 'next/link'

import { customerFetch } from '@/lib/customerAccount/client'
import { CUSTOMER_ORDERS } from '@/lib/customerAccount/queries'
import { formatDate, formatMoney, formatStatus } from '@/lib/customerAccount/format'

import styles from '../Account.module.scss'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 10

export default async function OrdersPage({ searchParams }) {
	const params = await searchParams
	const after = typeof params?.after === 'string' ? params.after : null

	const data = await customerFetch(CUSTOMER_ORDERS, { first: PAGE_SIZE, after })
	const connection = data?.customer?.orders
	const orders = connection?.nodes || []

	return (
		<>
			<h1 className={styles.pageTitle}>Orders</h1>
			<p className={styles.pageIntro}>
				Track your orders and request a return.
			</p>

			{orders.length === 0 ? (
				<div className={styles.empty}>
					<p>No orders to show.</p>
					<Link
						href='/shop/all/yellow-gold/all'
						className={`${styles.button} ${styles.buttonPrimary}`}
						style={{ marginTop: '1.5rem' }}
					>
						Start shopping
					</Link>
				</div>
			) : (
				<div className={styles.list}>
					{orders.map(order => {
						const previews = order.lineItems?.nodes || []
						return (
							<Link
								key={order.id}
								href={`/account/orders/${encodeURIComponent(order.id)}`}
								className={styles.listRow}
							>
								<span className={styles.listRowMain}>
									<span className={styles.thumbStack}>
										{previews
											.filter(item => item.image?.url)
											.slice(0, 3)
											.map((item, index) => (
												// eslint-disable-next-line @next/next/no-img-element
												<img
													key={`${order.id}-${index}`}
													src={item.image.url}
													alt={item.image.altText || item.title}
													className={styles.thumb}
												/>
											))}
									</span>
									<span>
										<span className={styles.orderName}>{order.name}</span>
										<br />
										<span className={styles.muted}>
											{formatDate(order.processedAt)}
										</span>
									</span>
								</span>

								<span className={styles.listRowMain}>
									<span className={styles.statusPill}>
										{formatStatus(order.financialStatus)}
									</span>
									<span>{formatMoney(order.totalPrice)}</span>
								</span>
							</Link>
						)
					})}
				</div>
			)}

			{connection?.pageInfo?.hasNextPage && (
				<div className={styles.formActions}>
					<Link
						href={`/account/orders?after=${encodeURIComponent(
							connection.pageInfo.endCursor
						)}`}
						className={styles.button}
					>
						Load older orders
					</Link>
				</div>
			)}

			{after && (
				<div className={styles.formActions}>
					<Link href='/account/orders' className={styles.buttonSubtle}>
						Back to newest
					</Link>
				</div>
			)}
		</>
	)
}
