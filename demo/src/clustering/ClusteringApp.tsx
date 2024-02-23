import { Rectangle } from 'react-leaflet'
import { coords2tile, tiles2clusters, Coords, TileSet } from 'tile-math'
import { OSMContainer } from '../OSMContainer'
import { sampleCoords } from '../sample-coords'

const tileZoom = 14 // VeloViewer and others use zoom-level 14 tiles
const mapZoom  = 13
const mapCenter : Coords = [51.48, -0.008]

const tiles = new TileSet().addAll(sampleCoords.map(latLon => coords2tile(latLon, tileZoom)))

// Compute the maximum cluster ('maxCluster'),
// all smaller clusters ('surrounded'), and
// the set of remaining tiles ('detached')
const { detached, surrounded, maxCluster } = tiles2clusters(tiles)

// For every tile, draws a red square on the map, using the Tile.bounds method.
const TileContainer = () => (
    <div>
        <>
            {detached.map((tile, index) => (
                <Rectangle key={index} bounds={tile.bounds(tileZoom)} pathOptions={{ color: 'red', weight: 0.5 }} />
            ))}
        </>
        <>
            {surrounded.map((tile, index) => (
                <Rectangle key={index} bounds={tile.bounds(tileZoom)} pathOptions={{ color: 'purple', weight: 2 }} />
            ))}
        </>
        <>
            {maxCluster.map((tile, index) => (
                <Rectangle key={index} bounds={tile.bounds(tileZoom)} pathOptions={{ color: 'blue', weight: 2 }} />
            ))}
        </>
    </div>
)

export const ClusteringApp = () => (
    <OSMContainer TileContainer={TileContainer} mapCenter={mapCenter} mapZoom={mapZoom} />
)
