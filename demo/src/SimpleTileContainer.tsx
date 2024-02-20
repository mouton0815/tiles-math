import { Rectangle, Polyline } from 'react-leaflet'
import { coords2tile, Coords, TileSet } from 'tile-math'

const zoom = 14

// Coordinates (lat, lon) taken e.g. from a GPX file
const coords: Array<Coords> = [
    [51.492084,  0.010122],
    [51.480127, -0.001128],
    [51.478603,  0.012518],
    [51.458606,  0.010687]
]

// Map all coordinates to tile names (https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames)
// and add them to a set. Duplicate tiles are ignored.
const tiles = new TileSet().addAll(coords.map(latLon => coords2tile(latLon, zoom)))

export const SimpleTileContainer = () => (
    <div>
        {tiles.map((tile, index) => (
            <Rectangle key={index} bounds={tile.bounds(zoom)} pathOptions={{ color: 'red', weight: 0.5 }} />
        ))}
        <Polyline positions={coords} />
    </div>
)
