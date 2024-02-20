import { useEffect, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { coords2tile, tile2coords, Coords, Tile, TileSet } from 'tile-math'
import { Tiles } from './Tiles'

function randomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

const TILE_ZOOM = 14 // Zoom level for tile math. 14 is the zoom used by VeloViewer and others.

// const center: Coords = [51.335793, 12.371988] // Neues Rathaus
const center: Coords = [51.482084, 0] // Greenwich
const centerTile = coords2tile(center, TILE_ZOOM)
const squareSize = 10 // The area to be filled with random tiles
const leftBorder = centerTile.x - squareSize / 2
const upperBorder = centerTile.y - squareSize / 2
const mapZoom = TILE_ZOOM - Math.ceil(squareSize / 10) - 1
const mapBounds = [
    tile2coords(leftBorder, upperBorder, mapZoom),
    tile2coords(leftBorder + squareSize, upperBorder + squareSize, mapZoom)
]
const iterations = squareSize * 30
const delay = Math.round(1 / (squareSize * squareSize) * 30000)

const initTileSet = new TileSet().add(centerTile)

export const App = () => {
    const [tileSet, setTileSet] = useState<TileSet>(initTileSet)

    useEffect(() => {
        const timer = (ms: number) => new Promise(res => setTimeout(res, ms));
        (async function() {
            for (let i = 0; i < iterations; i++) {
                const tile = Tile.of(leftBorder + randomInt(squareSize), upperBorder + randomInt(squareSize))
                setTileSet(new TileSet(tileSet.add(tile)))
                await timer(delay)
            }
        })()
    }, [])

    return (
        <MapContainer
            center={center}
            zoom={mapZoom}
            bounds={mapBounds}
            scrollWheelZoom={true}
            style={{ minHeight: '100vh', minWidth: '100vw' }}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Tiles tiles={tileSet} zoom={TILE_ZOOM} />
        </MapContainer>
    )
}
