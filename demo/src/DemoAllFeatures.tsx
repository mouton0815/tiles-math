import { useEffect, useState } from 'react'
import { Circle, Polyline, Rectangle } from 'react-leaflet'
import { coords2tile, cluster2boundaries, cluster2square, tiles2clusters, Coords, Tile, TileSet } from 'tile-math'
import { OSMContainer } from './OSMContainer'

// Constants controlling the map view and tile generation
const tileZoom = 14 // VeloViewer and others use zoom-level 14 tiles
const areaSize = 12 // Edge length of the map area to be filled with random tiles (should be an even number
const addDelay = 100 // Delay between adding two random tiles
const mapCenter : Coords = [51.476, -0.008]

type TilesContainerProps = {
    tileSet: TileSet
    tileZoom: number
}

// Displays detached tiles (red), minor clusters (purple), max cluster (blue), boundaries lines of
// the max cluster (blue), and the centroid of the max cluster (orange).
const TileContainer = ({ tileSet, tileZoom }: TilesContainerProps) => {
    const { detachedTiles, minorClusters, maxCluster } = tiles2clusters(tileSet)
    const maxSquare = cluster2square(maxCluster).getCenterSquare()
    const boundaries = cluster2boundaries(maxCluster)
    const centroid = maxCluster.centroid()
    return (
        <div>
            <>
                {detachedTiles.map((tile, index) => (
                    <Rectangle key={index} bounds={tile.bounds()} pathOptions={{ color: 'red', weight: 0.5, opacity: 0.5 }} />
                ))}
            </>
            <>
                {minorClusters.map((tile, index) => (
                    <Rectangle key={index} bounds={tile.bounds()} pathOptions={{ color: 'purple', weight: 1, opacity: 1 }} />
                ))}
            </>
            <>
                {maxCluster.map((tile, index) => (
                    <Rectangle key={index} bounds={tile.bounds()} pathOptions={{ color: 'blue', weight: 0.5, opacity: 0.5 }} />
                ))}
            </>
            <>
                {boundaries.map((line, index) => (
                    <Polyline key={index} positions={line.positions(tileZoom)} pathOptions={{ color: 'blue', weight: 2, opacity: 1 }} />
                ))}
            </>
            <>
                {maxSquare &&
                    <Rectangle bounds={maxSquare.bounds()} pane={'markerPane'} pathOptions={{ fill: false, color: 'yellow', weight: 3, opacity: 1 }} />
                }
            </>
            <>
                {centroid &&
                    <Circle center={centroid.position()} pane={'markerPane'} radius={200} pathOptions={{ color: 'orange', weight: 3, opacity: 1 }} />
                }
            </>
        </div>
    )
}

export const DemoAllFeatures = () => {
    const centerTile = coords2tile(mapCenter, tileZoom)
    const leftBorder = centerTile.x - areaSize / 2
    const upperBorder = centerTile.y - areaSize / 2
    const mapZoom = tileZoom - Math.ceil(areaSize / 12) - 1

    const initTileSet = new TileSet().add(centerTile)
    const [tileSet, setTileSet] = useState<TileSet>(initTileSet)

    useEffect(() => {
        // Call useEffect repeatedly to add more random tiles
        const timer = (ms: number) => new Promise(res => setTimeout(res, ms));
        (async function() {
            while (true) {
                const tile = Tile.of(leftBorder + randomInt(areaSize), upperBorder + randomInt(areaSize), tileZoom)
                setTileSet(new TileSet(tileSet.add(tile)))
                await timer(addDelay)
            }
        })()
    }, [])

    const tileContainer = <TileContainer tileSet={tileSet} tileZoom={tileZoom} />
    return (
        <OSMContainer tileContainer={tileContainer} mapCenter={mapCenter} mapZoom={mapZoom} />
    )
}

function randomInt(max: number): number {
    return Math.floor(Math.random() * max);
}