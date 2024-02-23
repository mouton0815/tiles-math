import { Rectangle } from 'react-leaflet'
import { cluster2square, coords2tile, tiles2clusters, Coords, TileSet } from 'tile-math'
import { OSMContainer } from './OSMContainer'
import { sampleCoords } from './sample-coords'

const tileZoom = 14 // VeloViewer and others use zoom-level 14 tiles
const mapZoom  = 13
const mapCenter : Coords = [51.48, -0.008]

const tiles = new TileSet().addAll(sampleCoords.map(latLon => coords2tile(latLon, tileZoom)))
const { detached, surrounded, maxCluster } = tiles2clusters(tiles)
const nonCluster = detached.merge(surrounded) // Do not distinguish between normal tiles and smaller clusters
const squares = cluster2square(maxCluster) // TODO: Add centroid to ctor of ClusterSquare
const centroid = maxCluster.centroid()
const maxSquare = centroid && squares.getCenterSquare(centroid)

// TODO: Description
const TileContainer = () => (
    <div>
        <>
            {nonCluster.map((tile, index) => (
                <Rectangle key={index} bounds={tile.bounds(tileZoom)} pathOptions={{ color: 'red', weight: 0.5 }} />
            ))}
        </>
        <>
            {maxCluster.map((tile, index) => (
                <Rectangle key={index} bounds={tile.bounds(tileZoom)} pathOptions={{ color: 'blue', weight: 0.5 }} />
            ))}
        </>
        <>
            {maxSquare &&
                <Rectangle bounds={maxSquare.bounds(tileZoom)} pathOptions={{ fill: false, color: 'yellow', weight: 3 }} />
            }
        </>
    </div>
)

export const MaxSquareApp = () => (
    <OSMContainer TileContainer={TileContainer} mapCenter={mapCenter} mapZoom={mapZoom} />
)
