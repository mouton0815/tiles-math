import { ReactElement } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { Coords } from 'tile-math'

type OSMContainerProps = {
    tileContainer: ReactElement
    mapCenter: Coords
    mapZoom: number
}

// Leaflet map container with OSM tiles
export const OSMContainer = ({ tileContainer, mapCenter, mapZoom }: OSMContainerProps) => (
    <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        style={{ minHeight: '100vh', minWidth: '100vw' }}>
        <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {tileContainer}
    </MapContainer>
)