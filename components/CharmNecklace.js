'use client'

import Image from 'next/image'
import { useApolloClient } from '@apollo/client/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import Accordion from './Accordion'
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
	caratOption,
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

const ShapeIcon = ({ shape, filled, size = 40, alt = '' }) => (
	<Image
		src={filled ? shape.path : shape.pathBase}
		alt={alt}
		width={Math.round((size * 3 * shape.width) / shape.height)}
		height={size * 3}
		quality={95}
		sizes={`${size * 2}px`}
		style={{ width: 'auto', height: size }}
	/>
)

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
	const firstKey = useRef(nextKey())
	const [slots, setSlots] = useState(() => [
		{
			key: firstKey.current,
			handle: product.handle,
			gold: initialGold || null
		}
	])
	const [activeKey, setActiveKey] = useState(firstKey.current)

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
		setSlots(current => {
			if (current.length < 2) return current
			const index = current.findIndex(slot => slot.key === key)
			const next = current.filter(slot => slot.key !== key)
			if (activeKey === key) {
				setActiveKey(next[Math.max(0, index - 1)]?.key)
			}
			return next
		})
	}

	const addSlot = () => {
		const key = nextKey()
		const metal = metalOptionName(product)
		let added = false
		setSlots(current => {
			if (current.length >= MAX_CHARMS) return current
			added = true
			return [
				...current,
				{
					key,
					handle: product.handle,
					gold: optionValueOrFirst(product, metal, initialGold || chainGold)
				}
			]
		})
		if (added) setActiveKey(key)
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
										transform: `translateX(${shift}%)`,
										filter:
											selection.slot.key === activeKey
												? 'drop-shadow(0 12px 14px rgba(26, 27, 24, 0.45))'
												: 'none'
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

						<Accordion
							title='Pendants'
							extraTitleText={
								slotSelections.find(item => item.slot.key === activeKey)?.shape
									?.title || `${slots.length}`
							}
							state={open === 'pendants'}
							setOpenOption={() => toggle('pendants')}
							product
							display
						>
							<div className={charmStyles.pendantPicker}>
								{slotSelections.map((selection, index) => {
									const active = selection.slot.key === activeKey
									return (
										<button
											key={selection.slot.key}
											type='button'
											className={`${charmStyles.pendantTab} ${
												active ? charmStyles.pendantTabActive : ''
											}`}
											onClick={() => setActiveKey(selection.slot.key)}
										>
											{selection.shape && (
												<ShapeIcon
													shape={selection.shape}
													filled={active}
													size={36}
												/>
											)}
											<span>{index + 1}</span>
										</button>
									)
								})}
								{slots.length < MAX_CHARMS && (
									<div className={charmStyles.pendantAddSlot}>
										<button
											type='button'
											className={charmStyles.pendantAdd}
											onClick={addSlot}
											aria-label='Add a pendant'
										>
											+
										</button>
										<span>{slots.length + 1}</span>
									</div>
								)}
							</div>

							{(() => {
								const index = slotSelections.findIndex(
									item => item.slot.key === activeKey
								)
								const selection = slotSelections[index]
								if (!selection) return null
								const metal = metalOptionName(selection.item)
								const metalOption = (selection.item?.options || []).find(
									option => option.name === metal
								)
								return (
									<div className={charmStyles.editor}>
										<div className={charmStyles.field}>
										<p className={charmStyles.optionLabel}>Diamond shape</p>
										<div
											className={`${styles.variantButtonsContainer} ${charmStyles.shapeRow}`}
										>
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
														<ShapeIcon
															shape={shape}
															filled={selected}
															size={44}
															alt={`${shape.title} pendant`}
														/>
													</button>
												)
											})}
										</div>
										</div>

										{caratOption(selection.item) && (
											<div className={charmStyles.field}>
												<p className={charmStyles.optionLabel}>
													Carat size
												</p>
												<div
													className={`${styles.variantButtonsContainer} ${charmStyles.shapeRow}`}
												>
													{caratOption(selection.item).optionValues.map(
														value => {
															const locked = Number(value.name) !== 0.2
															return (
																<button
																	key={value.name}
																	type='button'
																	disabled={locked}
																	className={
																		locked
																			? charmStyles.caratLocked
																			: undefined
																	}
																	style={{
																		fontWeight: locked
																			? 'normal'
																			: 'bold'
																	}}
																>
																	{value.name}
																</button>
															)
														}
													)}
												</div>
											</div>
										)}

										{metalOption && (
											<div className={charmStyles.field}>
												<p className={charmStyles.optionLabel}>
													Gold color
												</p>
												<div
													className={`${styles.variantButtonsContainer} ${charmStyles.shapeRow}`}
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
																	selection.slot.gold ===
																	value.name
																		? '1px solid #9b9b9b'
																		: '',
																padding: '2px',
																opacity:
																	selection.slot.gold ===
																	value.name
																		? 1
																		: 0.6
															}}
														>
															<Image
																src={`/${returnMetalType(value.name)}`}
																width={48}
																height={48}
																quality={95}
																alt={value.name}
																style={{
																	width: 22,
																	height: 22
																}}
															/>
														</button>
													))}
												</div>
											</div>
										)}

										<div className={charmStyles.slotActions}>
											<button
												type='button'
												onClick={() => moveSlot(index, -1)}
												disabled={index === 0}
											>
												<svg
													width='10'
													height='10'
													viewBox='0 0 10 10'
													aria-hidden='true'
												>
													<path
														d='M6.8 1.2 3 5l3.8 3.8'
														fill='none'
														stroke='currentColor'
														strokeWidth='1.2'
														strokeLinecap='round'
														strokeLinejoin='round'
													/>
												</svg>
												Move left
											</button>
											<button
												type='button'
												onClick={() => moveSlot(index, 1)}
												disabled={index === slots.length - 1}
											>
												Move right
												<svg
													width='10'
													height='10'
													viewBox='0 0 10 10'
													aria-hidden='true'
												>
													<path
														d='M3.2 1.2 7 5 3.2 8.8'
														fill='none'
														stroke='currentColor'
														strokeWidth='1.2'
														strokeLinecap='round'
														strokeLinejoin='round'
													/>
												</svg>
											</button>
											<button
												type='button'
												className={charmStyles.remove}
												onClick={() => removeSlot(selection.slot.key)}
												disabled={slots.length < 2}
											>
												Remove
											</button>
										</div>
									</div>
								)
							})()}
						</Accordion>
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
