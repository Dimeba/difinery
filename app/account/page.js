import Link from 'next/link'

import { customerFetch, customerFetchOptional } from '@/lib/customerAccount/client'
import {
	CUSTOMER_OVERVIEW,
	CUSTOMER_STORE_CREDIT
} from '@/lib/customerAccount/queries'
import {
	addressLines,
	formatDate,
	formatMoney,
	formatStatus,
	totalStoreCredit
} from '@/lib/customerAccount/format'

import styles from './Account.module.scss'

export const dynamic = 'force-dynamic'

function wishlistCount(metafieldValue) {
	if (!metafieldValue) return 0
	try {
		const parsed = JSON.parse(metafieldValue)
		return Array.isArray(parsed) ? parsed.length : 0
	} catch {
		return 0
	}
}

export default async function AccountOverviewPage() {
	// Store credit sits behind an optional scope, so it is fetched on its own
	// and allowed to come back empty.
	const [data, creditData] = await Promise.all([
		customerFetch(CUSTOMER_OVERVIEW),
		customerFetchOptional(CUSTOMER_STORE_CREDIT)
	])

	const customer = data?.customer

	const orders = customer?.orders?.nodes || []
	const credit = totalStoreCredit(creditData?.customer?.storeCreditAccounts)
	const saved = wishlistCount(customer?.metafield?.value)

	return (
		<>
			<h1 className={styles.pageTitle}>Overview</h1>
			<p className={styles.pageIntro}>
				{customer?.emailAddress?.emailAddress}
			</p>

			<div className={styles.cardGrid}>
				<div className={styles.card}>
					<p className={styles.cardLabel}>Store credit</p>
					<p className={styles.cardValue}>
						{credit ? formatMoney(credit) : '—'}
					</p>
				</div>

				<div className={styles.card}>
					<p className={styles.cardLabel}>Saved items</p>
					<p className={styles.cardValue}>{saved}</p>
				</div>

				<div className={styles.card}>
					<p className={styles.cardLabel}>Default address</p>
					{customer?.defaultAddress ? (
						<p className={styles.addressLines}>
							{addressLines(customer.defaultAddress)}
						</p>
					) : (
						<p className={styles.muted}>
							<Link href='/account/addresses'>Add an address</Link>
						</p>
					)}
				</div>
			</div>

			<h2 className={styles.sectionTitle}>Recent orders</h2>

			{orders.length === 0 ? (
				<div className={styles.empty}>
					<p>You haven&apos;t placed an order yet.</p>
					<Link
						href='/shop/all/yellow-gold/all'
						className={`${styles.button} ${styles.buttonPrimary}`}
						style={{ marginTop: '1.5rem' }}
					>
						Start shopping
					</Link>
				</div>
			) : (
				<>
					<div className={styles.list}>
						{orders.map(order => (
							<Link
								key={order.id}
								href={`/account/orders/${encodeURIComponent(order.id)}`}
								className={styles.listRow}
							>
								<span className={styles.listRowMain}>
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
						))}
					</div>

					<div className={styles.formActions}>
						<Link href='/account/orders' className={styles.buttonSubtle}>
							View all orders
						</Link>
					</div>
				</>
			)}
		</>
	)
}
