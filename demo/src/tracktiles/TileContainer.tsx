import { Rectangle, Polyline } from 'react-leaflet'
import { coords2tile, TileSet } from 'tile-math'
import { sampleCoords } from '../sample-coords'

const zoom = 14

// Map all coordinates to tile names (https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames)
// and add them to a set. Duplicate tiles are ignored.
const tiles = new TileSet().addAll(sampleCoords.map(latLon => coords2tile(latLon, zoom)))

// For every tile, draws a red square on the map, using the Tile.bounds method.
export const TileContainer = () => (
    <div>
        {tiles.map((tile, index) => (
            <Rectangle key={index} bounds={tile.bounds(zoom)} pathOptions={{ color: 'red', weight: 0.5 }} />
        ))}
        <Polyline positions={sampleCoords} />
    </div>
)
