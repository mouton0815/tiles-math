
//
// Demonstrates the computation of the maximum square of the max cluster.
// In general, there may be many max squares. The algorithm takes the one closest to the cluster centroid.
//

import { Rectangle } from 'react-leaflet'
import { cluster2square, tiles2clusters, TileSet } from 'tiles-math'
import { OSMContainer } from './OSMContainer'
import { sampleCoords } from './sample-coords'

const tileZoom = 14 // VeloViewer and others use zoom-level 14 tiles
const mapZoom  = 13

const tiles = new TileSet(tileZoom).addCoords(sampleCoords)
const { detachedTiles, minorClusters, maxCluster } = tiles2clusters(tiles)
const nonCluster = detachedTiles.merge(minorClusters) // Do not distinguish between normal tiles and smaller clusters
const maxSquare = cluster2square(maxCluster).getCenterSquare()

// Displays all tiles, the max cluster, and the max square.
const TileContainer = () => (
    <div>
        <>
            {nonCluster.map((tile, index) => (
                <Rectangle key={index} bounds={tile.bounds()} pathOptions={{ color: 'red', weight: 0.5 }} />
            ))}
        </>
        <>
            {maxCluster.map((tile, index) => (
                <Rectangle key={index} bounds={tile.bounds()} pathOptions={{ color: 'blue', weight: 0.5 }} />
            ))}
        </>
        <>
            {maxSquare &&
                <Rectangle bounds={maxSquare.bounds()} pathOptions={{ fill: false, color: 'yellow', weight: 4 }} />
            }
        </>
    </div>
)

export const DemoMaxSquare = () => (
    <OSMContainer tileContainer={<TileContainer />} mapZoom={mapZoom} />
)
