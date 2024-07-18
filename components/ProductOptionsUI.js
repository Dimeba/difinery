'use client'

// styles
import styles from './ProductInfo.module.scss'

// components
import Image from 'next/image'
import Accordion from './Accordion'

// hooks
import { useState } from 'react'
import { useCart } from '@/context/CartContext'

// context

const ProductOptionsUI = ({ product }) => {
	const [openOption, setOpenOption] = useState(0)
	const { addToCart } = useCart()

	return (
		<>
			<div className={styles.accordion}>
				{product.options.map((option, index) => (
					<Accordion
						key={option.id}
						small
						title={option.name}
						state={openOption == index ? true : false}
					>
						<div className={styles.variantButtonsContainer}>
							{option.values.map(value => (
								<button className={styles.variantButton} key={value.value}>
									{value.value}
								</button>
							))}
						</div>
					</Accordion>
				))}

				{/* <Accordion title='Metal Type' state={true}>
        <div>
            <Image
                src='/yellow.png'
                alt='Material type icon'
                width={32}
                height={32}
            />
            <Image
                src='/white.png'
                alt='Material type icon'
                width={32}
                height={32}
            />
            <Image
                src='/rose.png'
                alt='Material type icon'
                width={32}
                height={32}
            />
        </div>
    </Accordion> */}
			</div>

			<div className={styles.cartBox}>
				<p className={styles.orderDate}>
					Made to Order: Between 06.04-13.04 with you.
				</p>

				<button
					className={styles.cartButton}
					onClick={() => addToCart(product.variants[0].id, 1)}
				>
					ADD TO CART
				</button>

				<p className={styles.tax}>
					Tax included
					<br />
					Shipping calculated at checkout.
					<br />
					<b>$15 of your purchase goes to The New York Women's Foundation</b>
				</p>
			</div>
		</>
	)
}

export default ProductOptionsUI
