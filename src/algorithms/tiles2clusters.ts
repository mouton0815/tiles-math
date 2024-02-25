import { TileSet } from '../containers/TileSet'
import { TileClusters } from '../containers/TileClusters'

///
/// Finds all tile clusters in a set of {@link Tile}s and stores them in a {@link TileClusters} object.
///
export function tiles2clusters(tiles: TileSet): TileClusters {
    let clusters = new Array<TileSet>()
    const detached = new TileSet()
    for (const tile of tiles) {
        if (tiles.hasNeighbors(tile)) {
            let prevCluster : TileSet | null = null
            // Use filter function to allow in-place deletion of merged clusters
            clusters = clusters.filter(cluster => {
                if (cluster.hasNeighbor(tile)) {
                    if (prevCluster) {
                        // Tile is neighbor of prevCluster (and has been added to it)
                        // and of the current cluster: merge both clusters
                        prevCluster.merge(cluster)
                        return false
                    }
                    cluster.add(tile)
                    prevCluster = cluster
                }
                return true
            })
            if (prevCluster === null) {
                // Tile has four neighbors, but does not belong to an existing cluster yet
                clusters.push(new TileSet().add(tile))
            }
        } else {
            detached.add(tile)
        }
    }

    // Select the cluster with the largest size
    const maxCluster = clusters.reduce((prev, curr) => {
        return curr.size > prev.size ? curr : prev
    }, new TileSet())

    // Merge all other cluster candidates (and filter out maxCluster)
    const surrounded = clusters.reduce((prev, curr) => {
        if (curr === maxCluster) {
            return prev
        }
        // Merge the smaller cluster into the larger one
        if (prev.size >= curr.size) {
            return prev.merge(curr)
        }
        return curr.merge(prev)
    }, new TileSet())

    return { detachedTiles: detached, minorClusters: surrounded, maxCluster }
}