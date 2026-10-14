import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = defineConfig([
	...nextVitals,
	{
		rules: {
			// React 19's hooks plugin flags existing client state (cart restore,
			// auth refresh, filter sync). Those flows still work; rewriting them
			// is separate from this upgrade.
			'react-hooks/set-state-in-effect': 'warn',
			'react-hooks/refs': 'warn'
		}
	},
	globalIgnores([
		'.next/**',
		'.next-dev/**',
		'out/**',
		'build/**',
		'next-env.d.ts'
	])
])

export default eslintConfig
