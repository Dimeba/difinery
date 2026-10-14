'use client'

import { ApolloProvider } from '@apollo/client/react'
import { apolloClient } from '@/lib/apolloClient'

export function ApolloContext({ children }) {
	return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
