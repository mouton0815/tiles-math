import React from 'react'
import ReactDOM from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
// import { TrackTilesApp } from './tracktiles/TrackTilesApp'
// import { ClusteringApp } from './clustering/ClusteringApp'
// import { BoundariesApp } from './BoundariesApp'
// import { DemoMaxSquare } from './DemoMaxSquare'
import { DemoAllFeatures } from './DemoAllFeatures'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <DemoAllFeatures />
    </React.StrictMode>
)
