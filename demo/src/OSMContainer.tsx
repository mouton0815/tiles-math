import { ReactElement } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { Coords } from 'tiles-math'

const defaultCenter : Coords = [51.479, -0.008]

type OSMContainerProps = {
    tileContainer: ReactElement
    mapCenter?: Coords
    mapZoom: number
}

// Leaflet map container with OSM tiles
export const OSMContainer = ({ tileContainer, mapCenter, mapZoom }: OSMContainerProps) => (
    <MapContainer
        center={mapCenter || defaultCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        style={{ height: '100%', minWidth: '100%' }}>
        <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {tileContainer}
    </MapContainer>
)