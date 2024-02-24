
//
// Demonstrates the clustering of tiles into a max cluster, several minor clusters, and a set of detached tiles.
//

import { Rectangle } from 'react-leaflet'
import { coords2tile, tiles2clusters, Coords, TileSet } from '../dist'
import { OSMContainer } from './OSMContainer'
import { sampleCoords } from './sample-coords'

const tileZoom = 14 // VeloViewer and others use zoom-level 14 tiles
const mapZoom  = 13
const mapCenter : Coords = [51.48, -0.008]

const tiles = new TileSet().addAll(sampleCoords.map(latLon => coords2tile(latLon, tileZoom)))

// Compute the maximum cluster ('maxCluster'),
// all smaller clusters ('surrounded'), and
// the set of remaining tiles ('detached')
const { detached, surrounded, maxCluster } = tiles2clusters(tiles)

// Display the detached tiles (red), the minor clusters (purple), and the max cluster (blue).
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

export const DemoClustering = () => (
    <OSMContainer TileContainer={TileContainer} mapCenter={mapCenter} mapZoom={mapZoom} />
)
