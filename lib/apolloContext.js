'use client'

import { ApolloProvider } from '@apollo/client'
import { apolloClient } from '@/lib/apolloClient'

export function ApolloContext({ children }) {
	return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
