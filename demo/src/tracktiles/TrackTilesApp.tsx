import { MapContainer, TileLayer } from 'react-leaflet'
import { TileContainer } from './TileContainer'

const mapCenter = { lat: 51.48, lng: -0.008 }

export const TrackTilesApp = () => (
    <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} style={{ minHeight: '100vh', minWidth: '100vw' }}>
        <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <TileContainer />
    </MapContainer>
)
