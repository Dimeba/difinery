'use client'

// lib
import {
	client,
	createCheckout,
	updateCheckoutAttributes,
	addLineItems
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
			console.log(cart.webUrl)
		}
	}, [cart])

	const addToCart = async (variantId, quantity, customAtributes) => {
		const lineItemsToAdd = [{ variantId, quantity, customAtributes }]
		await addLineItems(cart.id, lineItemsToAdd).then(checkout =>
			setCart(checkout)
		)

		console.log(cart.totalPrice.amount)
	}

	const contextValue = {
		cart,
		addToCart,
		showCart,
		setShowCart
	}

	return (
		<CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
	)
}

export const useCart = () => useContext(CartContext)
