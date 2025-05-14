'use client'

// lib
import {
	client,
	createCheckout,
	updateCheckoutAttributes,
	addLineItems,
	removeLineItems
} from '@/lib/shopify'
import { useMutation } from '@apollo/client'
import { CREATE_CART } from '@/lib/mutations/createCart'
// hooks
import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback
} from 'react'

const CartContext = createContext({
	cart: null,
	createCart: async () => {},
	loading: false,
	error: null
})

export const CartProvider = ({ children }) => {
	const [cart, setCart] = useState(null)
	const [showCart, setShowCart] = useState(false)

	// prepare the mutation
	const [cartCreate, { loading, error }] = useMutation(CREATE_CART)

	// function to call when you want to (re)create a cart
	const createCart = useCallback(async () => {
		try {
			const { data } = await cartCreate()
			const createdCart = data.cartCreate.cart
			setCart(createdCart)
		} catch (err) {
			console.error('Cart creation failed', err)
			throw err
		}
	}, [cartCreate])

	useEffect(() => {
		if (!cart) {
			createCart()
		}

		if (cart) {
			console.log(cart)
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
