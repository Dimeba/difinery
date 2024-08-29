'use client'

// lib
import {
	client,
	createCheckout,
	updateCheckoutAttributes,
	addLineItems,
	removeLineItems
} from '@/lib/shopify'

// hooks
import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
	const [cart, setCart] = useState(null)
	const [showCart, setShowCart] = useState(false)

	useEffect(() => {
		if (!cart) {
			createCheckout().then(checkout => setCart(checkout))
		}

		if (cart) {
			// console.log(cart.webUrl)
		}
	}, [cart])

	const addToCart = async (variantId, quantity, customAttributes) => {
		const lineItemsToAdd = [{ variantId, quantity, customAttributes }]
		await addLineItems(cart.id, lineItemsToAdd).then(checkout =>
			setCart(checkout)
		)

		// console.log(cart.totalPrice.amount)
	}

	const removeFromCart = async lineItemId => {
		await removeLineItems(cart.id, [lineItemId]).then(checkout =>
			setCart(checkout)
		)
	}

	const updateQuantity = async (lineItemId, quantity) => {
		const lineItemsToUpdate = [{ id: lineItemId, quantity }]
		await client.checkout
			.updateLineItems(cart.id, lineItemsToUpdate)
			.then(checkout => setCart(checkout))
	}

	const contextValue = {
		cart,
		addToCart,
		showCart,
		setShowCart,
		removeFromCart,
		updateQuantity
	}

	return (
		<CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
	)
}

export const useCart = () => useContext(CartContext)
