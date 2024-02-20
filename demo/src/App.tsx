import { useEffect, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { coords2tile, tile2coords, Coords, Tile, TileSet } from 'tile-math'
import { Tiles } from './Tiles'

// Constants controlling the map view
const tileZoom = 14 // Zoom level for tile math (14 is the zoom used by VeloViewer and others)
const squareSize = 10 // Edge length of the map area to be filled with random tiles
const mapCenter: Coords = [51.482084, 0] // Greenwich

// Derived constants
const centerTile = coords2tile(mapCenter, tileZoom)
const leftBorder = centerTile.x - squareSize / 2
const upperBorder = centerTile.y - squareSize / 2
const mapZoom = tileZoom - Math.ceil(squareSize / 10) - 1
const mapBounds = [
    tile2coords(leftBorder, upperBorder, mapZoom),
    tile2coords(leftBorder + squareSize, upperBorder + squareSize, mapZoom)
]
const delay = Math.round(1 / (squareSize * squareSize) * 30000)

const initTileSet = new TileSet().add(centerTile)

export const App = () => {
    const [tileSet, setTileSet] = useState<TileSet>(initTileSet)

    useEffect(() => {
        // Call useEffect repeatedly to add more random tiles
        const timer = (ms: number) => new Promise(res => setTimeout(res, ms));
        (async function() {
            while (true) {
                const tile = Tile.of(leftBorder + randomInt(squareSize), upperBorder + randomInt(squareSize))
                setTileSet(new TileSet(tileSet.add(tile)))
                await timer(delay)
            }
        })()
    }, [])

    return (
        <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            bounds={mapBounds}
            scrollWheelZoom={true}
            style={{ minHeight: '100vh', minWidth: '100vw' }}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Tiles tiles={tileSet} zoom={tileZoom} />
        </MapContainer>
    )
}

function randomInt(max: number): number {
    return Math.floor(Math.random() * max);
}
