'use client'

// styles
import styles from './ProductInfo.module.scss'

// components
import Image from 'next/image'
import Accordion from './Accordion'

// hooks
import { useState } from 'react'

const ProductOptionsUI = ({ product }) => {
	const [openOption, setOpenOption] = useState(0)

	return (
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
	)
}

export default ProductOptionsUI
