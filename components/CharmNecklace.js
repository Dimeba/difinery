'use client'

import Image from 'next/image'
import { useApolloClient } from '@apollo/client/react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import Accordion from './Accordion'
import Button from './Button'
import styles from './ProductInfo.module.scss'
import mediaStyles from './ProductMediaPanel.module.scss'
import charmStyles from './CharmNecklace.module.scss'
import { useCart } from '@/context/CartContext'
import { returnMetalType } from '@/lib/helpers'
import { GET_PRODUCT_BY_HANDLE } from '@/lib/queries/getProductByHandle'
import { trackAddToCart } from '@/lib/gaEvents'
import customShapes from '@/data/shapes.json' with { type: 'json' }
import {
	CHAIN_HANDLE,
	MAX_CHARMS,
	bezelPendantHandles,
	chainImageUrl,
	displayDollars,
	findVariant,
	lockedCaratValue,
	metalOptionName,
	optionValueOrFirst,
	pendantAssetUrl,
	productForShape,
	shapeOfProduct
} from '@/lib/charmNecklace'

// Center-to-center shift, as a percent of the shared 1600px canvas.
// The widest pendant is about 12.5% of that canvas, so 16% leaves a gap.
const CHARM_SHIFT = 16

const nextKey = () =>
	typeof crypto !== 'undefined' && crypto.randomUUID
		? crypto.randomUUID()
		: `charm-${Date.now()}-${Math.random().toString(16).slice(2)}`

const CharmNecklace = ({ product, initialGold }) => {
	const client = useApolloClient()
	const { addLinesToCart, setShowCart } = useCart()
	const [chain, setChain] = useState(null)
	const [catalog, setCatalog] = useState(() =>
		product?.handle ? [product] : []
	)
	const [loading, setLoading] = useState(true)
	const [adding, setAdding] = useState(false)
	const [open, setOpen] = useState('chain-gold')

	const chainMetalName = metalOptionName(chain)
	const chainLengthOption = (chain?.options || []).find(option =>
		(option?.name || '').toLowerCase().includes('length')
	)

	const [chainGold, setChainGold] = useState(null)
	const [chainLength, setChainLength] = useState(null)
	const [slots, setSlots] = useState(() => [
		{
			key: nextKey(),
			handle: product.handle,
			gold: initialGold || null
		}
	])

	useEffect(() => {
		let cancelled = false

		const load = async () => {
			const handles = bezelPendantHandles(product).filter(
				handle => handle !== product.handle
			)

			try {
				const [chainResult, ...pendantResults] = await Promise.all([
					client.query({
						query: GET_PRODUCT_BY_HANDLE,
						variables: { handle: CHAIN_HANDLE }
					}),
					...handles.map(handle =>
						client.query({
							query: GET_PRODUCT_BY_HANDLE,
							variables: { handle }
						})
					)
				])

				if (cancelled) return

				const chainProduct = chainResult?.data?.productByHandle || null
				const pendants = pendantResults
					.map(result => result?.data?.productByHandle)
					.filter(Boolean)

				setChain(chainProduct)
				setCatalog([product, ...pendants])

				const metalName = metalOptionName(chainProduct)
				const preferredGold = (initialGold || '').toLowerCase().includes('white')
					? chainProduct?.options
							?.find(option => option.name === metalName)
							?.optionValues?.find(value =>
								value.name.toLowerCase().includes('white')
							)?.name
					: chainProduct?.options
							?.find(option => option.name === metalName)
							?.optionValues?.find(value =>
								value.name.toLowerCase().includes('yellow')
							)?.name

				setChainGold(
					preferredGold ||
						chainProduct?.options?.find(option => option.name === metalName)
							?.optionValues?.[0]?.name ||
						null
				)
				setChainLength(
					chainProduct?.options?.find(option =>
						option.name.toLowerCase().includes('length')
					)?.optionValues?.[0]?.name || null
				)
				setSlots(current =>
					current.map(slot => {
						const source =
							slot.handle === product.handle
								? product
								: pendants.find(item => item.handle === slot.handle)
						const metal = metalOptionName(source)
						return {
							...slot,
							gold: optionValueOrFirst(source, metal, slot.gold || initialGold)
						}
					})
				)
			} finally {
				if (!cancelled) setLoading(false)
			}
		}

		load()
		return () => {
			cancelled = true
		}
	}, [client, initialGold, product])

	const productByHandle = useCallback(
		handle => catalog.find(item => item.handle === handle) || null,
		[catalog]
	)

	const availableShapes = useMemo(
		() =>
			customShapes.filter(shape =>
				catalog.some(item =>
					(item.handle || '')
						.toLowerCase()
						.includes(shape.title.toLowerCase())
				)
			),
		[catalog]
	)

	const toggle = key => setOpen(current => (current === key ? '' : key))

	const updateSlot = (key, patch) => {
		setSlots(current =>
			current.map(slot => (slot.key === key ? { ...slot, ...patch } : slot))
		)
	}

	const moveSlot = (index, direction) => {
		setSlots(current => {
			const next = index + direction
			if (next < 0 || next >= current.length) return current
			const copy = [...current]
			const [item] = copy.splice(index, 1)
			copy.splice(next, 0, item)
			return copy
		})
	}

	const removeSlot = key => {
		setSlots(current =>
			current.length < 2 ? current : current.filter(slot => slot.key !== key)
		)
	}

	const addSlot = () => {
		setSlots(current => {
			if (current.length >= MAX_CHARMS) return current
			const used = new Set(
				current.map(slot => shapeOfProduct(productByHandle(slot.handle), customShapes)?.title)
			)
			const shape =
				availableShapes.find(item => !used.has(item.title)) || availableShapes[0]
			const nextProduct = shape ? productForShape(catalog, shape.title) : product
			if (!nextProduct) return current
			const metal = metalOptionName(nextProduct)
			return [
				...current,
				{
					key: nextKey(),
					handle: nextProduct.handle,
					gold: optionValueOrFirst(nextProduct, metal, chainGold)
				}
			]
		})
	}

	const chainVariant = useMemo(() => {
		if (!chain || !chainMetalName || !chainLengthOption) return null
		return findVariant(chain, {
			[chainMetalName]: chainGold,
			[chainLengthOption.name]: chainLength
		})
	}, [chain, chainGold, chainLength, chainLengthOption, chainMetalName])

	const slotSelections = useMemo(
		() =>
			slots.map(slot => {
				const item = productByHandle(slot.handle)
				const metal = metalOptionName(item)
				const caratName = (item?.options || []).find(option =>
					option.name.toLowerCase().includes('carat')
				)?.name
				const selected = {}
				if (metal && slot.gold) selected[metal] = slot.gold
				const carat = lockedCaratValue(item)
				if (caratName && carat) selected[caratName] = carat
				const variant = item ? findVariant(item, selected) : null
				return { slot, item, variant, shape: shapeOfProduct(item, customShapes) }
			}),
		[productByHandle, slots]
	)

	const total = useMemo(() => {
		const amounts = [
			chainVariant?.price?.amount,
			...slotSelections.map(selection => selection.variant?.price?.amount)
		]
		return amounts.reduce((sum, amount) => sum + displayDollars(amount), 0)
	}, [chainVariant, slotSelections])

	const ready =
		!loading &&
		chainVariant &&
		slotSelections.length > 0 &&
		slotSelections.every(selection => selection.variant)

	const onAdd = async () => {
		if (!ready || adding) return
		setAdding(true)
		try {
			await addLinesToCart([
				{ merchandiseId: chainVariant.id, quantity: 1 },
				...slotSelections.map(selection => ({
					merchandiseId: selection.variant.id,
					quantity: 1
				}))
			])
			trackAddToCart(chain, chainVariant, 1)
			slotSelections.forEach(selection =>
				trackAddToCart(selection.item, selection.variant, 1)
			)
			setShowCart(true)
		} catch (error) {
			console.error('Add charm necklace failed', error)
		} finally {
			setAdding(false)
		}
	}

	const chainUrl = chainImageUrl(chain, chainGold)

	return (
		<>
			<div className={mediaStyles.mediaPanel}>
				<div className={charmStyles.stage}>
					{chainUrl && (
						<Image
							src={chainUrl}
							alt='Necklace chain'
							fill
							sizes='(max-width: 1024px) 90vw, 50vw'
							style={{ objectFit: 'contain' }}
						/>
					)}
					<div className={charmStyles.charms}>
						{slotSelections.map((selection, index) => {
							const asset = pendantAssetUrl(
								selection.item,
								selection.slot.gold
							)
							if (!asset) return null
							const count = slotSelections.length
							const shift = (index - (count - 1) / 2) * CHARM_SHIFT
							return (
								<Image
									key={selection.slot.key}
									src={asset}
									alt={selection.item?.title || 'Pendant'}
									fill
									sizes='(max-width: 1024px) 90vw, 50vw'
									className={charmStyles.charm}
									style={{
										objectFit: 'contain',
										transform: `translateX(${shift}%)`
									}}
								/>
							)
						})}
					</div>
				</div>
			</div>

			<div className={styles.content}>
				<div className={styles.versionInfo}>
					<div className={styles.titleRow}>
						<h3>Bezel Charm Necklace</h3>
					</div>
				</div>

				{ready && <p>${total.toLocaleString()}</p>}

				<p>
					A chain and up to five pendants. Each pendant is set in 0.20 carat.
				</p>

				{loading ? (
					<p>Loading chain and pendants…</p>
				) : (
					<div className={styles.accordion}>
						{chainMetalName && (
							<Accordion
								title='Chain Gold'
								extraTitleText={chainGold}
								state={open === 'chain-gold'}
								setOpenOption={() => toggle('chain-gold')}
								product
								display
							>
								<div className={styles.variantButtonsContainer}>
									{(
										chain.options.find(option => option.name === chainMetalName)
											?.optionValues || []
									).map(value => (
										<button
											key={value.name}
											type='button'
											onClick={() => setChainGold(value.name)}
											style={{
												borderRadius: '50%',
												border:
													chainGold === value.name
														? '1px solid #9b9b9b'
														: '',
												padding: '2px',
												opacity: chainGold === value.name ? 1 : 0.6
											}}
										>
											<Image
												src={`/${returnMetalType(value.name)}`}
												width={20}
												height={20}
												alt={value.name}
											/>
										</button>
									))}
								</div>
							</Accordion>
						)}

						{chainLengthOption && (
							<Accordion
								title='Chain Length'
								extraTitleText={chainLength}
								state={open === 'chain-length'}
								setOpenOption={() => toggle('chain-length')}
								product
								display
							>
								<div className={styles.variantButtonsContainer}>
									{chainLengthOption.optionValues.map(value => (
										<button
											key={value.name}
											type='button'
											onClick={() => setChainLength(value.name)}
											style={{
												fontWeight:
													chainLength === value.name ? 'bold' : 'normal'
											}}
										>
											{value.name}
										</button>
									))}
								</div>
							</Accordion>
						)}

						{slotSelections.map((selection, index) => {
							const metal = metalOptionName(selection.item)
							const metalOption = (selection.item?.options || []).find(
								option => option.name === metal
							)
							return (
								<Accordion
									key={selection.slot.key}
									title={`Pendant ${index + 1}`}
									extraTitleText={selection.shape?.title || null}
									state={open === selection.slot.key}
									setOpenOption={() => toggle(selection.slot.key)}
									product
									display
								>
									<div className={styles.variantButtonsContainer}>
										{availableShapes.map(shape => {
											const selected =
												selection.shape?.title === shape.title
											return (
												<button
													key={shape.title}
													type='button'
													onClick={() => {
														const next = productForShape(
															catalog,
															shape.title
														)
														if (!next) return
														const nextMetal = metalOptionName(next)
														updateSlot(selection.slot.key, {
															handle: next.handle,
															gold: optionValueOrFirst(
																next,
																nextMetal,
																selection.slot.gold
															)
														})
													}}
												>
													<Image
														src={
															selected ? shape.path : shape.pathBase
														}
														width={(32 * shape.width) / shape.height}
														height={32}
														alt={`${shape.title} pendant`}
													/>
												</button>
											)
										})}
									</div>

									{metalOption && (
										<div
											className={styles.variantButtonsContainer}
											style={{ marginTop: '1rem' }}
										>
											{metalOption.optionValues.map(value => (
												<button
													key={value.name}
													type='button'
													onClick={() =>
														updateSlot(selection.slot.key, {
															gold: value.name
														})
													}
													style={{
														borderRadius: '50%',
														border:
															selection.slot.gold === value.name
																? '1px solid #9b9b9b'
																: '',
														padding: '2px',
														opacity:
															selection.slot.gold === value.name
																? 1
																: 0.6
													}}
												>
													<Image
														src={`/${returnMetalType(value.name)}`}
														width={20}
														height={20}
														alt={value.name}
													/>
												</button>
											))}
										</div>
									)}

									<div className={charmStyles.slotActions}>
										<button
											type='button'
											onClick={() => moveSlot(index, -1)}
											disabled={index === 0}
										>
											Move left
										</button>
										<button
											type='button'
											onClick={() => moveSlot(index, 1)}
											disabled={index === slots.length - 1}
										>
											Move right
										</button>
										<button
											type='button'
											onClick={() => removeSlot(selection.slot.key)}
											disabled={slots.length < 2}
										>
											Remove
										</button>
									</div>
								</Accordion>
							)
						})}
					</div>
				)}

				{slots.length < MAX_CHARMS && !loading && (
					<div className={charmStyles.addPendant}>
						<Button text='Add a pendant' fullWidth onClick={addSlot} />
					</div>
				)}

				<button
					type='button'
					className={styles.cartButton}
					disabled={!ready || adding}
					onClick={onAdd}
				>
					Add to Cart
				</button>
			</div>
		</>
	)
}

export default CharmNecklace
