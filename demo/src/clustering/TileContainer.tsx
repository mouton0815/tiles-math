import { Rectangle } from 'react-leaflet'
import { coords2tile, tiles2clusters, TileSet } from 'tile-math'
import { sampleCoords } from '../sample-coords'

const zoom = 14

const tiles = new TileSet().addAll(sampleCoords.map(latLon => coords2tile(latLon, zoom)))

// Compute the maximum cluster ('maxCluster'),
// all smaller clusters ('surrounded'), and
// the set of remaining tiles ('detached')
const { detached, surrounded, maxCluster } = tiles2clusters(tiles)

// For every tile, draws a red square on the map, using the Tile.bounds method.
export const TileContainer = () => (
    <div>
        <>
            {detached.map((tile, index) => (
                <Rectangle key={index} bounds={tile.bounds(zoom)} pathOptions={{ color: 'red', weight: 0.5 }} />
            ))}
        </>
        <>
            {surrounded.map((tile, index) => (
                <Rectangle key={index} bounds={tile.bounds(zoom)} pathOptions={{ color: 'purple', weight: 2 }} />
            ))}
        </>
        <>
            {maxCluster.map((tile, index) => (
                <Rectangle key={index} bounds={tile.bounds(zoom)} pathOptions={{ color: 'blue', weight: 2 }} />
            ))}
        </>
    </div>
)
