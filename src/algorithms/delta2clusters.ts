import { TileSet } from '../containers/TileSet'
import { TileClusters } from '../containers/TileClusters'
import { TileNo } from '../types/TileNo'

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
        allClusters: new Array<TileSet>(),
        maxCluster: new TileSet(zoom),
        minorClusters: new TileSet(zoom),
        detachedTiles: new TileSet(zoom)
    }
    // All tiles in newTiles that are indeed new, that is, not part of clusters.allTiles:
    const diffTiles  = prevClusters ? clusters.allTiles.mergeDiff(newTiles) : newTiles
    // Tiles that were formerly detached and are now part of a cluster:
    const clusteredTiles = new TileSet(zoom)
    const closedClusters = new Array<TileSet>()
    for (const x of diffTiles.getSortedXs()) {
        // Remove every cluster that cannot contain any further processed tile with larger x values
        clusters.allClusters = clusters.allClusters.filter(cluster => {
            if (cluster.isLeftOf(x)) {
                closedClusters.push(cluster)
                return false
            }
            return true
        })
        for (const y of diffTiles.getSortedYs(x)) { // Note: Iteration through the entire column
            if (prevClusters) {
                add2clusters(clusters, clusteredTiles, { x: x - 1, y }) // Left neighbor
                add2clusters(clusters, clusteredTiles, { x: x + 1, y }) // Right neighbor
                add2clusters(clusters, clusteredTiles, { x, y: y - 1 }) // Upper neighbor
                add2clusters(clusters, clusteredTiles, { x, y: y + 1 }) // Lower neighbor
            }
            add2clusters(clusters, clusteredTiles, { x, y }, true)
        }
    }
    clusters.allClusters.unshift(...closedClusters)

    // Select the cluster with the largest size
    clusters.maxCluster = clusters.allClusters.reduce((prev, curr) => {
        return curr.getSize() > prev.getSize() ? curr : prev
    }, new TileSet(zoom))

    // Merge all other cluster candidates (and filter out maxCluster)
    clusters.minorClusters = clusters.allClusters.reduce((prev, curr) => {
        if (curr === clusters.maxCluster) {
            return prev
        }
        // Merge the smaller cluster into the larger one
        if (prev.getSize() >= curr.getSize()) {
            return prev.merge(curr)
        }
        return curr.merge(prev)
    }, new TileSet(zoom))

    if (clusteredTiles.getSize() > 0) {
        // If tiles needed to be removed from detachedTile, we have to copy the set.
        // Just removing a tile from detachedTiles would not work, because the re-computation of
        // the bounding box is expensive (potentially requires touching every tile in the set).
        const detachedOld = clusters.detachedTiles
        clusters.detachedTiles = new TileSet(zoom)
        for (const tile of detachedOld) {
            if (!clusteredTiles.has(tile)) {
                clusters.detachedTiles.addTile(tile)
            }
        }
    }
    return clusters
}

function add2clusters(clusters: TileClusters, detachedDrop: TileSet, tile: TileNo, newTile: boolean = false) {
    if (newTile || clusters.allTiles.has(tile)) {
        if (clusters.allTiles.hasNeighbors(tile)) {
            let prevCluster: TileSet | null = null
            // Use filter function to allow in-place deletion of merged clusters
            clusters.allClusters = clusters.allClusters.filter(cluster => {
                if (cluster.hasNeighbor(tile)) {
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
                clusters.allClusters.push(new TileSet(clusters.allTiles.getZoom()).addTiles([tile]))
            }
            if (clusters.detachedTiles.has(tile)) {
                detachedDrop.addTile(tile)
            }
        } else if (newTile) {
            clusters.detachedTiles.addTile(tile)
        }
    }
}