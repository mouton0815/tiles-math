import { TileSet } from '../containers/TileSet'
import { Cluster, TileClusters } from '../containers/TileClusters'
import { TileNo } from '../types/TileNo'

// TODO: Create new instances
// TODO: Merge algo with tiles2clusters ?
/**
 * Finds all tile clusters in a {@link TileSet} and stores them in a {@link TileClusters} object.
 * @param newTiles - a tile set
 * @param prevClusters - an optional cluster tuple computed at a previous step
 * @returns all tile clusters of the tile set
 */
export function delta2clusters(newTiles: TileSet, prevClusters?: TileClusters): TileClusters {
    const zoom = newTiles.getZoom()
    const clusters : TileClusters = prevClusters || {
        allTiles: newTiles,
        allClusters: new Array<Cluster>(),
        maxCluster: new TileSet(zoom),
        minorClusters: new TileSet(zoom),
        detachedTiles: new TileSet(zoom)
    }
    const deltaTiles  = prevClusters ? clusters.allTiles.deltaMerge(newTiles) : newTiles
    const closedClusters = new Array<Cluster>()
    for (const x of deltaTiles.getSortedXs()) {
        // Remove every cluster that cannot contain any further processed tile with larger x values
        clusters.allClusters = clusters.allClusters.filter(cluster => {
            if (cluster.isLeftOf(x)) {
                closedClusters.push(cluster)
                return false
            }
            return true
        })
        for (const y of deltaTiles.getSortedYs(x)) { // Note: Iteration through the entire column
            if (prevClusters) {
                add2clusters(clusters, { x: x - 1, y }) // Left neighbor
                add2clusters(clusters, { x: x + 1, y }) // Right neighbor
                add2clusters(clusters, { x, y: y - 1 }) // Upper neighbor
                add2clusters(clusters, { x, y: y + 1 }) // Lower neighbor
            }
            add2clusters(clusters, { x, y }, true)
        }
    }
    clusters.allClusters.unshift(...closedClusters)

    // Select the cluster with the largest size
    clusters.maxCluster = clusters.allClusters.reduce((prev, curr) => {
        return curr.tiles.getSize() > prev.getSize() ? curr.tiles : prev
    }, new TileSet(zoom))

    // Merge all other cluster candidates (and filter out maxCluster)
    clusters.minorClusters = clusters.allClusters.reduce((prev, curr) => {
        if (curr.tiles === clusters.maxCluster) {
            return prev
        }
        // Merge the smaller cluster into the larger one
        if (prev.getSize() >= curr.tiles.getSize()) {
            return prev.merge(curr.tiles)
        }
        return curr.tiles.merge(prev)
    }, new TileSet(zoom))

    return clusters
}

function add2clusters(clusters: TileClusters, tile: TileNo, newTile: boolean = false) {
    if (newTile || clusters.allTiles.has(tile)) {
        if (clusters.allTiles.hasNeighbors(tile)) {
            let prevCluster: Cluster | null = null
            // Use filter function to allow in-place deletion of merged clusters
            clusters.allClusters = clusters.allClusters.filter(cluster => {
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
                clusters.allClusters.push(new Cluster(tile, clusters.allTiles.getZoom()))
            }
            clusters.detachedTiles.removeTile(tile)
        } else if (newTile) {
            clusters.detachedTiles.addTile(tile)
        }
    }
}