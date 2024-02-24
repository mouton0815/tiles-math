import { useEffect, useState } from 'react'
import { Circle, Polyline, Rectangle } from 'react-leaflet'
import { coords2tile, cluster2boundaries, cluster2square, tiles2clusters, Coords, Tile, TileSet } from 'tile-math'
import { OSMContainer } from './OSMContainer'

// Constants controlling the map view
const tileZoom = 14 // Zoom level for tile math (14 is the zoom used by VeloViewer and others)
const squareSize = 10 // Edge length of the map area to be filled with random tiles
const mapCenter: Coords = [51.482084, 0] // Greenwich

// Derived constants
const centerTile = coords2tile(mapCenter, tileZoom)
const leftBorder = centerTile.x - squareSize / 2
const upperBorder = centerTile.y - squareSize / 2
const mapZoom = tileZoom - Math.ceil(squareSize / 10) - 1
const delay = Math.round(1 / (squareSize * squareSize) * 30000)


type TilesContainerProps = {
    tiles: TileSet
    zoom: number
}

const TileContainer = ({ tiles, zoom }: TilesContainerProps) => {
    const clusters = tiles2clusters(tiles)
    const squares = cluster2square(clusters.maxCluster)
    const centroid = clusters.maxCluster.centroid()
    const maxSquare = centroid && squares.getCenterSquare(centroid)
    const boundaries = cluster2boundaries(clusters.maxCluster)
    return (
        <div>
            <>
                {clusters.detached.map((tile, index) => (
                    <Rectangle key={index} bounds={tile.bounds(zoom)} pathOptions={{ color: 'red', weight: 0.5, opacity: 0.5 }} />
                ))}
            </>
            <>
                {clusters.surrounded.map((tile, index) => (
                    <Rectangle key={index} bounds={tile.bounds(zoom)} pathOptions={{ color: 'purple', weight: 1, opacity: 1 }} />
                ))}
            </>
            <>
                {clusters.maxCluster.map((tile, index) => (
                    <Rectangle key={index} bounds={tile.bounds(zoom)} pathOptions={{ color: 'blue', weight: 0.5, opacity: 0.5 }} />
                ))}
            </>
            <>
                {boundaries.map((line, index) => (
                    <Polyline key={index} positions={line.positions(zoom)} pathOptions={{ color: 'blue', weight: 2, opacity: 1 }} />
                ))}
            </>
            <>
                {maxSquare &&
                    <Rectangle bounds={maxSquare.bounds(zoom)} pane={'markerPane'} pathOptions={{ fill: false, color: 'yellow', weight: 3, opacity: 1 }} />
                }
            </>
            <>
                {centroid &&
                    <Circle center={centroid.position(zoom)} pane={'markerPane'} radius={200} pathOptions={{ color: 'orange', weight: 3, opacity: 1 }} />
                }
            </>
        </div>
    )
}


export const DemoAllFeatures = () => {
    const initTileSet = new TileSet().add(centerTile)
    const [tileSet, setTileSet] = useState<TileSet>(initTileSet)

    useEffect(() => {
        // Call useEffect repeatedly to add more random tiles
        const timer = (ms: number) => new Promise(res => setTimeout(res, ms));
        (async function() {
            while (true) {
                const tile = Tile.of(leftBorder + randomInt(squareSize), upperBorder + randomInt(squareSize))
                setTileSet(new TileSet(tileSet.add(tile)))
                await timer(delay)
            }
        })()
    }, [])

    const tileContainer = <TileContainer tiles={tileSet} zoom={tileZoom} />
    return (
        <OSMContainer tileContainer={tileContainer} mapCenter={mapCenter} mapZoom={mapZoom} />
    )
}

function randomInt(max: number): number {
    return Math.floor(Math.random() * max);
}