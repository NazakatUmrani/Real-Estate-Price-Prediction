import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/custom/Theme/ThemeContext.tsx'
import ThemeSwitcher from './components/custom/Theme/ThemeSwitcher.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
