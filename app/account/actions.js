'use server'

import { revalidatePath } from 'next/cache'

import { customerFetch, UnauthorizedError } from '@/lib/customerAccount/client'
import {
	ADDRESS_CREATE,
	ADDRESS_DELETE,
	ADDRESS_UPDATE,
	CUSTOMER_UPDATE,
	ORDER_REQUEST_RETURN
} from '@/lib/customerAccount/queries'

const OK = { status: 'success', message: '' }

function failed(message) {
	return { status: 'error', message }
}

function firstError(userErrors) {
	if (!userErrors?.length) return null
	return userErrors.map(e => e.message).join(', ')
}

/** Wraps an action so an expired session surfaces as a normal form error. */
async function run(fn) {
	try {
		return await fn()
	} catch (error) {
		if (error instanceof UnauthorizedError) {
			return failed('Your session expired. Please sign in again.')
		}
		console.error('Account action failed:', error.message)
		return failed('Something went wrong. Please try again.')
	}
}

function addressFromForm(formData) {
	// Only send fields the customer actually filled in — Shopify rejects
	// empty strings for territoryCode/zoneCode.
	const raw = {
		firstName: formData.get('firstName'),
		lastName: formData.get('lastName'),
		company: formData.get('company'),
		address1: formData.get('address1'),
		address2: formData.get('address2'),
		city: formData.get('city'),
		zoneCode: formData.get('zoneCode'),
		territoryCode: formData.get('territoryCode'),
		zip: formData.get('zip'),
		phoneNumber: formData.get('phoneNumber')
	}

	const address = {}
	for (const [key, value] of Object.entries(raw)) {
		const trimmed = typeof value === 'string' ? value.trim() : ''
		if (trimmed) address[key] = trimmed
	}
	return address
}

export async function updateProfile(prevState, formData) {
	return run(async () => {
		const input = {
			firstName: (formData.get('firstName') || '').toString().trim(),
			lastName: (formData.get('lastName') || '').toString().trim()
		}

		if (!input.firstName) return failed('First name is required.')

		const data = await customerFetch(CUSTOMER_UPDATE, { input })
		const error = firstError(data?.customerUpdate?.userErrors)
		if (error) return failed(error)

		revalidatePath('/account')
		revalidatePath('/account/profile')
		return { ...OK, message: 'Profile updated.' }
	})
}

export async function createAddress(prevState, formData) {
	return run(async () => {
		const address = addressFromForm(formData)

		if (!address.address1 || !address.city || !address.territoryCode) {
			return failed('Address, city and country are required.')
		}

		const data = await customerFetch(ADDRESS_CREATE, {
			address,
			defaultAddress: formData.get('defaultAddress') === 'on'
		})
		const error = firstError(data?.customerAddressCreate?.userErrors)
		if (error) return failed(error)

		revalidatePath('/account/addresses')
		revalidatePath('/account')
		return { ...OK, message: 'Address added.' }
	})
}

export async function updateAddress(prevState, formData) {
	return run(async () => {
		const addressId = formData.get('addressId')
		if (!addressId) return failed('Missing address.')

		const data = await customerFetch(ADDRESS_UPDATE, {
			addressId,
			address: addressFromForm(formData),
			defaultAddress: formData.get('defaultAddress') === 'on'
		})
		const error = firstError(data?.customerAddressUpdate?.userErrors)
		if (error) return failed(error)

		revalidatePath('/account/addresses')
		revalidatePath('/account')
		return { ...OK, message: 'Address updated.' }
	})
}

export async function deleteAddress(prevState, formData) {
	return run(async () => {
		const addressId = formData.get('addressId')
		if (!addressId) return failed('Missing address.')

		const data = await customerFetch(ADDRESS_DELETE, { addressId })
		const error = firstError(data?.customerAddressDelete?.userErrors)
		if (error) return failed(error)

		revalidatePath('/account/addresses')
		revalidatePath('/account')
		return { ...OK, message: 'Address removed.' }
	})
}

export async function setDefaultAddress(prevState, formData) {
	return run(async () => {
		const addressId = formData.get('addressId')
		if (!addressId) return failed('Missing address.')

		// customerAddressUpdate is also the way to promote an existing address;
		// an empty address payload leaves the fields untouched.
		const data = await customerFetch(ADDRESS_UPDATE, {
			addressId,
			address: {},
			defaultAddress: true
		})
		const error = firstError(data?.customerAddressUpdate?.userErrors)
		if (error) return failed(error)

		revalidatePath('/account/addresses')
		revalidatePath('/account')
		return { ...OK, message: 'Default address updated.' }
	})
}

export async function requestReturn(prevState, formData) {
	return run(async () => {
		const orderId = formData.get('orderId')
		const reason = (formData.get('returnReason') || '').toString().trim()
		const note = (formData.get('customerNote') || '').toString().trim()

		// 2026-07 dropped the free-form returnReason enum in favour of merchant
		// defined reason definitions, so the shopper's reason rides along in the
		// note rather than in a field we can't resolve an id for.
		const customerNote = [reason, note].filter(Boolean).join(' — ').slice(0, 300)

		// Checkboxes named `lineItem` carry "<lineItemId>:<quantity>".
		const requestedLineItems = formData
			.getAll('lineItem')
			.map(entry => {
				const separator = entry.toString().lastIndexOf(':')
				return {
					lineItemId: entry.toString().slice(0, separator),
					quantity: Number(entry.toString().slice(separator + 1)) || 1,
					...(customerNote ? { customerNote } : {})
				}
			})
			.filter(item => item.lineItemId)

		if (!orderId) return failed('Missing order.')
		if (!requestedLineItems.length) {
			return failed('Select at least one item to return.')
		}

		const data = await customerFetch(ORDER_REQUEST_RETURN, {
			orderId,
			requestedLineItems
		})
		const error = firstError(data?.orderRequestReturn?.userErrors)
		if (error) return failed(error)

		revalidatePath(`/account/orders`)
		return {
			...OK,
			message: 'Return requested. We will email you once it is reviewed.'
		}
	})
}
