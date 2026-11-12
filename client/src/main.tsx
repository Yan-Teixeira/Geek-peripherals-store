import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { CatalogProvider } from './contexts/CatalogContext'
import { CartProvider } from './contexts/CartContext'
import './index.css'
import './application.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><BrowserRouter><AuthProvider><CatalogProvider><CartProvider><App/></CartProvider></CatalogProvider></AuthProvider></BrowserRouter></React.StrictMode>,
)

import './catalog.css'
import './refinements.css'

import './interactions.css'
