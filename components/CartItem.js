// styles
import styles from './Cart.module.scss'

// components
import Image from 'next/image'
import { MdDeleteForever } from 'react-icons/md'

const CartItem = ({ node, removeAllrelatedItems, removeFromCart }) => {
	// Guard against undefined node or merchandise
	if (!node) return null
	const { id: lineId, quantity } = node
	const variant = node.merchandise
	if (!variant) return null

	const title = variant.product?.title || '—'
	const imageUrl = variant.image?.url
	const imageAlt = variant.image?.altText || title

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
					<Image
						src={imageUrl}
						alt={imageAlt}
						fill
						style={{
							objectFit: title === 'Difinery Gift Card' ? 'cover' : 'contain'
						}}
					/>

					<div className={styles.removeIcon}>
						<MdDeleteForever
							size='1rem'
							onClick={() => handleRemove(lineId, title)}
							cursor='pointer'
						/>
					</div>
				</div>
			)}
		</div>
	)
}

export default CartItem
