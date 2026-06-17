import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import SupplyMatch from '../supply.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SupplyMatch />
    <Analytics />
  </React.StrictMode>,
)
