import React from 'react'
import ReactDOM from 'react-dom/client'
import { SimpleTileApp } from './SimpleTileApp'
import 'leaflet/dist/leaflet.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SimpleTileApp />
    </React.StrictMode>
)
