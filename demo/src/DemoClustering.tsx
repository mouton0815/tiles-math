
//
// Demonstrates the clustering of tiles into a max cluster, several minor clusters, and a set of detached tiles.
//

import { Rectangle } from 'react-leaflet'
import { tiles2clusters, TileSet } from 'tiles-math'
import { OSMContainer } from './OSMContainer'
import { sampleCoords } from './sample-coords'

const tileZoom = 14 // VeloViewer and others use zoom-level 14 tiles
const mapZoom  = 13

const tiles = new TileSet(tileZoom).addCoords(sampleCoords)

// Compute the maximum cluster ('maxCluster'),
// all smaller clusters ('surrounded'), and
// the set of remaining tiles ('detached')
const { detachedTiles, minorClusters, maxCluster } = tiles2clusters(tiles)

// Displays the detached tiles (red), the minor clusters (purple), and the max cluster (blue).
const TileContainer = () => (
    <div>
        <>
            {detachedTiles.map((tile, index) => (
                <Rectangle key={index} bounds={tile.bounds()} pathOptions={{ color: 'red', weight: 0.5 }} />
            ))}
        </>
        <>
            {minorClusters.map((tile, index) => (
                <Rectangle key={index} bounds={tile.bounds()} pathOptions={{ color: 'purple', weight: 2 }} />
            ))}
        </>
        <>
            {maxCluster.map((tile, index) => (
                <Rectangle key={index} bounds={tile.bounds()} pathOptions={{ color: 'blue', weight: 2 }} />
            ))}
        </>
    </div>
)

export const DemoClustering = () => (
    <OSMContainer tileContainer={<TileContainer />} mapZoom={mapZoom} />
)
