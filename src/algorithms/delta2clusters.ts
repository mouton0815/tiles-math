import { TileSet } from '../containers/TileSet'
import { TileClusters } from '../containers/TileClusters'
import { TileNo } from '../types/TileNo'

// TODO: Merge algo with tiles2clusters ?
/**
 * Finds all tile clusters in a {@link TileSet} and stores them in a {@link TileClusters} object.
 * @param tiles - a tile set to be clustered (or added to an existing cluster tuple)
 * @param prevClusters - an optional cluster tuple computed at a previous step
 * @returns all tile clusters of the tile set
 */
export function delta2clusters(tiles: TileSet, prevClusters?: TileClusters): TileClusters {
    const zoom = tiles.getZoom()
    const clusters : TileClusters = prevClusters || {
        allTiles: tiles,
        allClusters: new Array<TileSet>(),
        maxCluster: new TileSet(zoom),
        minorClusters: new TileSet(zoom),
        detachedTiles: new TileSet(zoom)
    }
    // All tiles in the input set that are indeed new, i.e., are not part of clusters.allTiles:
    const newTiles  = prevClusters ? clusters.allTiles.mergeDiff(tiles) : tiles
    // Tiles that were formerly detached and are now part of a cluster:
    const undetachedTiles = new TileSet(zoom)
    // Stores all tile clusters that are out of reach for the current tiles:
    const closedClusters = new Array<TileSet>()

    // Put all non-intersecting clusters in closedClusters (in incremental mode only):
    if (prevClusters) {
        clusters.allClusters = clusters.allClusters.filter(cluster => {
            if (cluster.isDetachedFrom(newTiles)) {
                closedClusters.push(cluster)
                return false
            }
            return true
        })
    }

    for (const x of newTiles.getSortedXs()) {
        // Remove every cluster that cannot contain any further processed tile with larger x values.
        // Note that the x and y axes are ordered.
        clusters.allClusters = clusters.allClusters.filter(cluster => {
            if (cluster.isLeftOf(x)) {
                closedClusters.push(cluster)
                return false
            }
            return true
        })
        for (const y of newTiles.getSortedYs(x)) {
            if (prevClusters) { // Those checks are only needed in incremental mode
                add2clusters(clusters, undetachedTiles, { x: x - 1, y }) // Left neighbor
                add2clusters(clusters, undetachedTiles, { x: x + 1, y }) // Right neighbor
                add2clusters(clusters, undetachedTiles, { x, y: y - 1 }) // Upper neighbor
                add2clusters(clusters, undetachedTiles, { x, y: y + 1 }) // Lower neighbor
            }
            add2clusters(clusters, undetachedTiles, { x, y }, true)
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
        return prev.merge(curr)
    }, new TileSet(zoom))

    if (undetachedTiles.getSize() > 0) {
        // If tiles needed to be removed from detachedTile, we have to copy the set.
        // Just removing a tile from detachedTiles would not work, because the re-computation of
        // the bounding box is expensive (potentially requires touching every tile in the set).
        const detachedOld = clusters.detachedTiles
        clusters.detachedTiles = new TileSet(zoom)
        for (const tile of detachedOld) {
            if (!undetachedTiles.has(tile)) {
                clusters.detachedTiles.addTile(tile)
            }
        }
    }
    return clusters
}

function add2clusters(clusters: TileClusters, unDetachedTiles: TileSet, tile: TileNo, newTile: boolean = false) {
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
            if (clusters.detachedTiles.has(tile)) { // TODO: !newTile should be sufficient
                unDetachedTiles.addTile(tile)
            }
        } else if (newTile) { // Otherwise it is already in detachedTiles
            clusters.detachedTiles.addTile(tile)
        }
    }
}