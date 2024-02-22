import { Rectangle, Polyline } from 'react-leaflet'
import { coords2tile, Coords, TileSet } from 'tile-math'

const zoom = 14

// Coordinates (lat, lon) taken e.g. from a GPX file.
// Note that indexes 1 and 2 map to the same tile.
const coords: Array<Coords> = [
    [51.488084,  0.013122],
    [51.476927, -0.006128],
    [51.470527, -0.009128],
    [51.468603,  0.012518],
    [51.458606,  0.010687]
]

// Map all coordinates to tile names (https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames)
// and add them to a set. Duplicate tiles are ignored.
const tiles = new TileSet().addAll(coords.map(latLon => coords2tile(latLon, zoom)))

// For every tile, draws a red square on the map, using the Tile.bounds method.
export const TileContainer = () => (
    <div>
        {tiles.map((tile, index) => (
            <Rectangle key={index} bounds={tile.bounds(zoom)} pathOptions={{ color: 'red', weight: 0.5 }} />
        ))}
        <Polyline positions={coords} />
    </div>
)
