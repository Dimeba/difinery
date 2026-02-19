// styles
import styles from './Cart.module.scss'

// components
import Image from 'next/image'
import Link from 'next/link'
import { MdDeleteForever } from 'react-icons/md'
import { FiMinus, FiPlus } from 'react-icons/fi'

<<<<<<< HEAD
const CartItem = ({ node, removeAllrelatedItems, removeFromCart }) => {
=======
// analytics
import { trackRemoveFromCart } from '@/lib/gaEvents'

const CartItem = ({
	node,
	removeAllrelatedItems,
	removeFromCart,
	handleIncrease,
	handleDecrease
}) => {
>>>>>>> master
	// Guard against undefined node or merchandise
	if (!node) return null
	const { id: lineId, quantity } = node
	const variant = node.merchandise
	if (!variant) return null

	const title = variant.product?.title || '—'
	const imageUrl = variant.image?.url
	const imageAlt = variant.image?.altText || title
	const productHandle = variant.product?.handle
	const rawCategoryName = variant.product?.category?.name?.toLowerCase() || ''

	// Map category name to URL slug (e.g., "Rings" -> "rings", "Bracelets" -> "bracelets")
	const categories = ['bracelets', 'earrings', 'rings', 'necklaces']
	const matchedCategory = categories.find(cat =>
		rawCategoryName.includes(cat.slice(0, -1))
	)
	const categoryName = matchedCategory || 'all'

	// Build product URL
	const productUrl = productHandle
		? `/shop/${categoryName}/product/${productHandle}`
		: null

	// Safely parse unit price
	const unitRaw = variant.priceV2?.amount
	const unitPrice = unitRaw ? parseFloat(unitRaw).toFixed(2) : '0.00'

	const handleRemove = (lineId, productTitle) => {
		removeAllrelatedItems(lineId, productTitle)
	}

	return (
		<div className={styles.item}>
			<div className={styles.itemContent}>
				<p
					className={styles.itemTitle}
					style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
				>
					{title !== 'Engraving' && title !== 'Custom Box' && productUrl ? (
						<Link href={productUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
							{title}
						</Link>
					) : (
						<>
							{title}{' '}
							{(title === 'Engraving' || title == 'Custom Box') &&
								`+$${Number(unitPrice.slice(0, -3)).toLocaleString()}`}
							{(title === 'Engraving' || title == 'Custom Box') && (
								<MdDeleteForever
									size='1rem'
									onClick={() => handleRemove(lineId, title)}
									cursor='pointer'
								/>
							)}
						</>
					)}
				</p>

				{title !== 'Engraving' && title !== 'Custom Box' && (
					<>
						<div className={styles.selectedOptions}>
							{variant.selectedOptions?.map(option => (
								<p key={option.name}>
									{option.name}: {option.value}
								</p>
							))}
						</div>
						<div className={styles.itemPriceContainer}>
							<p>Price: ${Number(unitPrice.slice(0, -3)).toLocaleString()}</p>
						</div>
					</>
				)}
			</div>

			{imageUrl && title !== 'Engraving' && title !== 'Custom Box' && (
				<div className={styles.itemImage}>
					<div className={styles.imageWrapper}>
						{productUrl ? (
							<Link href={productUrl} style={{ position: 'relative', width: '100%', height: '100%', display: 'block' }}>
								<Image
									src={imageUrl}
									alt={imageAlt}
									fill
									style={{
										objectFit: title === 'Difinery Gift Card' ? 'cover' : 'contain'
									}}
								/>
							</Link>
						) : (
							<Image
								src={imageUrl}
								alt={imageAlt}
								fill
								style={{
									objectFit: title === 'Difinery Gift Card' ? 'cover' : 'contain'
								}}
							/>
						)}

						<div className={styles.removeIcon}>
							<MdDeleteForever
								size='1rem'
								onClick={() => handleRemove(lineId, title)}
								cursor='pointer'
							/>
						</div>
					</div>

					<div className={styles.itemQuantity}>
						<button
							onClick={() => handleDecrease(lineId, quantity)}
							className={styles.quantityButton}
							aria-label='Decrease quantity'
						>
							<FiMinus size='1rem' />
						</button>
						<span className={styles.quantityValue}>{quantity}</span>
						<button
							onClick={() => handleIncrease(lineId, quantity)}
							className={styles.quantityButton}
							aria-label='Increase quantity'
						>
							<FiPlus size='1rem' />
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default CartItem
