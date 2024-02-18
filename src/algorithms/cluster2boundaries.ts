import { TileSet } from '../containers/TileSet'
import { ClusterBoundaries } from '../containers/ClusterBoundaries'

///
/// Computes the boundary line(s) of the cluster.
///
export function cluster2boundaries(cluster: TileSet): ClusterBoundaries {
    const boundaries = new ClusterBoundaries()
    for (const x of cluster.getSortedXs()) {
        const ySet = cluster.getYSet(x) // All y coordinates of tiles with x
        const ySetL = cluster.getYSet(x - 1) // Left neighbors
        const ySetR = cluster.getYSet(x + 1) // Right neighbors
        for (const y of cluster.getSortedYs(x)) {
            // Check for neighbors counterclockwise
            if (!ySet.has(y - 1)) { // Has upper neighbor?
                boundaries.addUpperEdge(x, y)
            }
            if (!ySetL.has(y)) { // Has left neighbor?
                boundaries.addLeftEdge(x, y)
            }
            if (!ySet.has(y + 1)) { // Has lower neighbor?
                boundaries.addLowerEdge(x, y)
            }
            if (!ySetR.has(y)) { // Has right neighbor?
                boundaries.addRightEdge(x, y)
            }
        }
    }
    return boundaries
}