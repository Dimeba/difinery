'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Typography, Box } from '@mui/material'

export default function NotFound() {
	const router = useRouter()

	const [secondsLeft, setSecondsLeft] = useState(3)

	// countdown tick
	useEffect(() => {
		if (secondsLeft <= 0) return
		const id = setTimeout(() => setSecondsLeft(s => s - 1), 1000)
		return () => clearTimeout(id)
	}, [secondsLeft])

	// redirect once finished (side effect separated from state updater)
	useEffect(() => {
		if (secondsLeft === 0) {
			// replace so user can't go "Back" to the 404 page
			router.replace('/')
		}
	}, [secondsLeft, router])

	return (
		<main>
			<section>
				<div className='container'>
					<Box sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
						<Typography variant='h2' component='h2'>
							Page not found
						</Typography>
						<Typography variant='body2' sx={{ mt: 2 }}>
							Redirecting to homepage in {secondsLeft}…
						</Typography>
					</Box>
				</div>
			</section>
		</main>
	)
}
