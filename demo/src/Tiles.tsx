import { Circle, Polyline, Rectangle } from 'react-leaflet'
import { cluster2boundaries, cluster2square, tiles2clusters, TileSet } from 'tile-math'

type TilesProps = {
    tiles: TileSet
    zoom: number
}

export const Tiles = ({ tiles, zoom }: TilesProps) => {
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
                {/*squares.mapRectangles((rect, index) => (
                    <Rectangle key={index} bounds={rect.bounds(zoom)} pathOptions={{ pane: 'markerPane', fill: false, color: 'yellow', weight: 3, opacity: 1 }} />
                ))*/}
            </>
            <>
                {centroid &&
                    <Circle center={centroid.position(zoom)} pane={'markerPane'} radius={200} pathOptions={{ color: 'orange', weight: 3, opacity: 1 }} />
                }
            </>
        </div>
    )
}
