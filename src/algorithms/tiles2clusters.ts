import { TileSet } from '../containers/TileSet'
import { TileClusters } from '../containers/TileClusters'
import { TileNo } from '../types/TileNo'

/**
 * Finds all tile clusters in a {@link TileSet} and stores them in a {@link TileClusters} object.
 * @param tiles - a tile set
 * @returns all tile clusters of the tile set
 */
export function tiles2clusters(tiles: TileSet): TileClusters {
    const zoom = tiles.getZoom()
    let activeClusters = new Array<Cluster>()
    const closedClusters = new Array<Cluster>()
    const detachedTiles = new TileSet(zoom)
    for (const x of tiles.getSortedXs()) {
        for (const y of tiles.getSortedYs(x)) {
            const tile : TileNo = { x, y }
            // Remove every cluster that cannot contain any further processed tile with larger x and y values
            activeClusters = activeClusters.filter(cluster => {
                if (cluster.isOutside(tile)) {
                    closedClusters.push(cluster)
                    return false
                }
                return true
            })
            if (tiles.hasNeighbors(tile)) {
                let prevCluster : Cluster | null = null
                // Use filter function to allow in-place deletion of merged clusters
                activeClusters = activeClusters.filter(cluster => {
                    if (cluster.tiles.hasNeighbor(tile)) {
                        if (prevCluster) {
                            // Tile is neighbor of prevCluster (and has been added to it)
                            // and of the current cluster: merge both clusters
                            prevCluster.merge(cluster)
                            return false
                        }
                        cluster.addTile(tile)
                        prevCluster = cluster
                    }
                    return true
                })
                if (prevCluster === null) {
                    // Tile has four neighbors, but does not belong to an existing cluster yet
                    activeClusters.push(new Cluster(tile, zoom))
                }
            } else {
                detachedTiles.addTile(tile)
            }
        }
    }
    activeClusters.unshift(...closedClusters)

    // Select the cluster with the largest size
    const maxCluster = activeClusters.reduce((prev, curr) => {
        return curr.tiles.getSize() > prev.getSize() ? curr.tiles : prev
    }, new TileSet(zoom))

    // Merge all other cluster candidates (and filter out maxCluster)
    const minorClusters = activeClusters.reduce((prev, curr) => {
        if (curr.tiles === maxCluster) {
            return prev
        }
        // Merge the smaller cluster into the larger one
        if (prev.getSize() >= curr.tiles.getSize()) {
            return prev.merge(curr.tiles)
        }
        return curr.tiles.merge(prev)
    }, new TileSet(zoom))

    return { detachedTiles, minorClusters, maxCluster }
}

class Cluster {
    tiles: TileSet
    private marginRight: number
    private marginBelow: number
    constructor(tile: TileNo, zoom: number) {
        this.tiles = new TileSet(zoom).addTile(tile)
        this.marginRight = tile.x + 1
        this.marginBelow = tile.y + 1
    }
    addTile(tile: TileNo) {
        this.tiles.addTile(tile)
        this.marginRight = Math.max(this.marginRight, tile.x + 1)
        this.marginBelow = Math.max(this.marginBelow, tile.y + 1)
    }
    isOutside({ x, y }: TileNo): boolean {
        return this.marginRight < x || this.marginBelow < y
    }
    merge(other: Cluster) {
        for (const tile of other.tiles) {
            this.addTile(tile)
        }
    }
}