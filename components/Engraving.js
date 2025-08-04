'use client'

// styles
import styles from './ProductInfo.module.scss'

// hooks
import { useEffect, useState } from 'react'

// lib
import { useApolloClient } from '@apollo/client'
import { GET_PRODUCT_BY_HANDLE } from '@/lib/queries/getProductByHandle'

const Engraving = ({
	product,
	engraving,
	setEngraving,
	setEngravingVariant
}) => {
	const [engravingProduct, setEngravingProduct] = useState(null)

	const client = useApolloClient()

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await client.query({
				query: GET_PRODUCT_BY_HANDLE,
				variables: { handle: 'engraving' }
			})

			setEngravingProduct(data.productByHandle)
			setEngravingVariant(data.productByHandle.variants.edges[0].node)
		}

		fetchData()
	}, [client])

	return (
		<div className={styles.inputContainer}>
			<div className={styles.inputText}>
				<p>Personalize your jewelry with a message that lasts a lifetime.</p>

				{engravingProduct && (
					<input
						type='text'
						placeholder={
							product.category.name === 'Rings'
								? 'Type up to 15 characters'
								: 'Type up to 10 characters'
						}
						value={engraving}
						onChange={e => setEngraving(e.target.value)}
						className={styles.engravingInput}
						maxLength={product.category.name === 'Rings' ? 15 : 10}
					/>
				)}
				<p
					style={{
						fontSize: '10px',
						fontStyle: 'italic'
					}}
				>
					*Additional $20
				</p>
			</div>
		</div>
	)
}

export default Engraving
