'use client'

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback
} from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_CART } from '@/lib/mutations/createCart'
import { ADD_PRODUCT } from '@/lib/mutations/addProduct'
import { REMOVE_PRODUCT } from '@/lib/mutations/removeProduct'
import { UPDATE_PRODUCT } from '@/lib/mutations/updateProduct'

const CartContext = createContext({
	cart: null,
	createCart: async () => {},
	addToCart: async () => {},
	removeFromCart: async () => {},
	updateQuantity: async () => {},
	showCart: false,
	setShowCart: () => {}
})

export const CartProvider = ({ children }) => {
	const [cart, setCart] = useState(null)
	const [showCart, setShowCart] = useState(false)

	// Cart creation
	const [cartCreate, { loading: creating, error: createError }] = useMutation(
		CREATE_CART,
		{
			onCompleted: data => setCart(data.cartCreate.cart)
		}
	)

	// Mutations for add/update/remove
	const [addProduct, { loading: adding, error: addError }] =
		useMutation(ADD_PRODUCT)
	const [removeProduct, { loading: removing, error: removeError }] =
		useMutation(REMOVE_PRODUCT)
	const [updateProduct, { loading: updating, error: updateError }] =
		useMutation(UPDATE_PRODUCT)

	const createCart = useCallback(async () => {
		const { data } = await cartCreate()
		return data.cartCreate.cart
	}, [cartCreate])

	useEffect(() => {
		if (!cart) createCart()
	}, [cart, createCart])

	const addToCart = useCallback(
		async (variantId, quantity, attributes = []) => {
			if (!cart) await createCart()
			const variables = {
				cartId: cart.id,
				lines: [{ merchandiseId: variantId, quantity, attributes }]
			}
			const { data } = await addProduct({ variables })
			if (data.cartLinesAdd.userErrors.length) {
				throw new Error(
					data.cartLinesAdd.userErrors.map(e => e.message).join(', ')
				)
			}
			setCart(data.cartLinesAdd.cart)
			return data.cartLinesAdd.cart
		},
		[cart, createCart, addProduct]
	)

	const removeFromCart = useCallback(
		async lineItemId => {
			if (!cart) return
			const variables = { cartId: cart.id, lineIds: [lineItemId] }
			const { data } = await removeProduct({ variables })
			if (data.cartLinesRemove.userErrors.length) {
				throw new Error(
					data.cartLinesRemove.userErrors.map(e => e.message).join(', ')
				)
			}
			setCart(data.cartLinesRemove.cart)
			return data.cartLinesRemove.cart
		},
		[cart, removeProduct]
	)

	const updateQuantity = useCallback(
		async (lineItemId, quantity) => {
			if (!cart) return
			const variables = {
				cartId: cart.id,
				lines: [{ id: lineItemId, quantity }]
			}
			const { data } = await updateProduct({ variables })
			if (data.cartLinesUpdate.userErrors.length) {
				throw new Error(
					data.cartLinesUpdate.userErrors.map(e => e.message).join(', ')
				)
			}
			setCart(data.cartLinesUpdate.cart)
			return data.cartLinesUpdate.cart
		},
		[cart, updateProduct]
	)

	return (
		<CartContext.Provider
			value={{
				cart,
				showCart,
				setShowCart,
				createCart,
				addToCart,
				removeFromCart,
				updateQuantity,
				loading: creating || adding || removing || updating,
				error: createError || addError || removeError || updateError
			}}
		>
			{children}
		</CartContext.Provider>
	)
}

export const useCart = () => useContext(CartContext)
