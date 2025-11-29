import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeContextProvider } from './context/ThemeContext'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './store/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeContextProvider>
          <App />
        </ThemeContextProvider>
      </QueryClientProvider>
    </ReduxProvider>
  </StrictMode>,
)
