
//
// Demonstrates the computation of the boundary line(s) of the max cluster.
//

import { Polyline, Rectangle } from 'react-leaflet'
import { cluster2boundaries, tiles2clusters, TileSet } from 'tiles-math'
import { OSMContainer } from './OSMContainer'
import { sampleCoords } from './sample-coords'

const tileZoom = 14 // VeloViewer and others use zoom-level 14 tiles
const mapZoom  = 13

const tiles = new TileSet(tileZoom).addCoords(sampleCoords)
const { detachedTiles, minorClusters, maxCluster } = tiles2clusters(tiles)
const nonCluster = detachedTiles.merge(minorClusters) // Do not distinguish between normal tiles and smaller clusters
const boundaries = cluster2boundaries(maxCluster)

// Displays all tiles, the max cluster, and the boundary line around the max cluster.
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
            {boundaries.map((line, index) => (
                <Polyline key={index} positions={line.positions()} pathOptions={{ color: 'blue', weight: 4 }} />
            ))}
        </>
    </div>
)

export const DemoBoundaries = () => (
    <OSMContainer tileContainer={<TileContainer />} mapZoom={mapZoom} />
)
