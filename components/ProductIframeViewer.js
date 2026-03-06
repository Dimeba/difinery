'use client'

import styles from './ProductMediaPanel.module.scss'

const ProductIframeViewer = ({ modelId, sku = '' }) => {
	return (
		<div
			className={styles.images}
			style={{
				backgroundColor: 'rgba(0, 0, 0, 0.03)'
			}}
		>
			<div
				className={styles.image}
				style={{
					backgroundColor: 'rgba(0, 0, 0, 0.03)'
				}}
			>
				<iframe
					title={`${sku || 'product'}-3d`}
					frameBorder='0'
					allowFullScreen
					allow='camera; autoplay; fullscreen; xr-spatial-tracking; web-share'
					src={`https://ijewel3d.com/drive/files/${modelId}/embedded?slug=${modelId}&isTitle=false&isRemoveHologram=true&isRemoveLogo=true&isRemoveLogoLink=true&isAutoplay=true&isTransparentBackground=true&isConfigurator=false&isEnabledZoom=false&isFitObject=false&isFullScreen=false`}
					className={styles.imageFrame}
				/>
				<div className={styles.imageFrameOverlay} aria-hidden='true' />
			</div>
		</div>
	)
}

export default ProductIframeViewer
