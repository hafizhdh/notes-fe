// app/providers.tsx
'use client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import '@fontsource/kalam'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { useState } from 'react'

const theme = extendTheme({
  fonts: {
    heading: `'Kalam', sans-serif`
  }
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <ReactQueryDevtools initialIsOpen={false} />
          {children}
      </ChakraProvider>
    </QueryClientProvider>
  )
}