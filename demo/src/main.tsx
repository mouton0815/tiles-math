import React from 'react'
import ReactDOM from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import { TrackTilesApp } from './tracktiles/TrackTilesApp'
//import { ClusteringApp } from './clustering/ClusteringApp'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <TrackTilesApp />
    </React.StrictMode>
)
