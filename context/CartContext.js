'use client'

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	useRef
} from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_CART } from '@/lib/mutations/createCart'
import { ADD_PRODUCT } from '@/lib/mutations/addProduct'
import { REMOVE_PRODUCT } from '@/lib/mutations/removeProduct'
import { UPDATE_PRODUCT } from '@/lib/mutations/updateProduct'

const CART_STORAGE_KEY = 'difinery_cart_items'

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
	const hasRestoredRef = useRef(false)

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

	// Save cart items to localStorage
	const saveCartToStorage = useCallback(cartData => {
		if (!cartData || !cartData.lines) return
		
		try {
			const itemsToSave = cartData.lines.edges.map(({ node }) => ({
				variantId: node.merchandise.id,
				quantity: node.quantity,
				attributes: node.attributes || []
			}))
			localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(itemsToSave))
		} catch (error) {
			console.error('Error saving cart to localStorage:', error)
		}
	}, [])

	// Load cart items from localStorage and restore them
	const restoreCartFromStorage = useCallback(async () => {
		if (hasRestoredRef.current) return
		hasRestoredRef.current = true

		try {
			const savedItems = localStorage.getItem(CART_STORAGE_KEY)
			if (!savedItems) {
				// No saved items, create empty cart
				await createCart()
				return
			}

			const items = JSON.parse(savedItems)
			if (!items || items.length === 0) {
				// Empty saved items, create empty cart
				await createCart()
				return
			}

			// Create a new cart first
			const { data: cartData } = await cartCreate()
			let currentCart = cartData.cartCreate.cart
			setCart(currentCart)

			// Restore all items
			for (const item of items) {
				try {
					const variables = {
						cartId: currentCart.id,
						lines: [
							{
								merchandiseId: item.variantId,
								quantity: item.quantity,
								attributes: item.attributes
							}
						]
					}
					const { data } = await addProduct({ variables })
					if (data.cartLinesAdd.cart) {
						currentCart = data.cartLinesAdd.cart
						setCart(currentCart)
					}
				} catch (error) {
					console.error('Error restoring cart item:', error)
				}
			}
		} catch (error) {
			console.error('Error restoring cart from localStorage:', error)
			// If restoration fails, create empty cart
			await createCart()
		}
	}, [cartCreate, addProduct])

	// Save cart to localStorage whenever it changes (but not during restoration)
	useEffect(() => {
		if (cart && hasRestoredRef.current) {
			saveCartToStorage(cart)
		}
	}, [cart, saveCartToStorage])

	// Restore cart from localStorage on mount (before creating empty cart)
	useEffect(() => {
		restoreCartFromStorage()
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

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

	const addToCart = useCallback(
		async (variantId, quantity, attributes = []) => {
			let currentCart = cart
			if (!currentCart) {
				currentCart = await createCart()
			}
			
			// Check if item with same variant and attributes already exists
			const existingLine = currentCart?.lines?.edges?.find(({ node }) => {
				const sameVariant = node.merchandise?.id === variantId
				if (!sameVariant) return false
				
				// Compare attributes - they must match exactly
				const nodeAttrs = node.attributes || []
				if (nodeAttrs.length !== attributes.length) return false
				
				const attrsMatch = attributes.every(attr => 
					nodeAttrs.some(na => na.key === attr.key && na.value === attr.value)
				) && nodeAttrs.every(na => 
					attributes.some(attr => attr.key === na.key && attr.value === na.value)
				)
				
				return attrsMatch
			})
			
			// If item exists, update quantity instead of adding new line
			if (existingLine) {
				const newQuantity = existingLine.node.quantity + quantity
				return await updateQuantity(existingLine.node.id, newQuantity)
			}
			
			// Otherwise, add new line item
			const variables = {
				cartId: currentCart.id,
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
		[cart, createCart, addProduct, updateQuantity]
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
			const updatedCart = data.cartLinesRemove.cart
			setCart(updatedCart)
			// Clear localStorage if cart is empty
			if (!updatedCart.lines.edges.length) {
				localStorage.removeItem(CART_STORAGE_KEY)
			}
			return updatedCart
		},
		[cart, removeProduct]
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
