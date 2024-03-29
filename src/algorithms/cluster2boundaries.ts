import { TileSet } from '../containers/TileSet'
import { ClusterBoundaries } from '../containers/ClusterBoundaries'

/**
 * Computes the boundary {@link BoundaryPolyline}(s) of a {@link TileSet} cluster.
 * A cluster has more than one boundary polyline if it has empty spaces inside.
 * Each polyline can be mapped to a sequence of {@link Coords} compatible with Leaflet's Polyline map element.
 * @param cluster - a tile cluster
 * @returns the set of cluster boundaries (polylines)
 */
export function cluster2boundaries(cluster: TileSet): ClusterBoundaries {
    const zoom = cluster.getZoom()
    const boundaries = new ClusterBoundaries()
    for (const x of cluster.getSortedXs()) {
        boundaries.closeLeftOf(x)
        const ySet = cluster.getYSet(x) // All y coordinates of tiles with x
        const ySetL = cluster.getYSet(x - 1) // Left neighbors
        const ySetR = cluster.getYSet(x + 1) // Right neighbors
        for (const y of cluster.getSortedYs(x)) {
            // Check for neighbors counterclockwise
            if (!ySet.has(y - 1)) { // Has upper neighbor?
                boundaries.addUpperEdge(x, y, zoom)
            }
            if (!ySetL.has(y)) { // Has left neighbor?
                boundaries.addLeftEdge(x, y, zoom)
            }
            if (!ySet.has(y + 1)) { // Has lower neighbor?
                boundaries.addLowerEdge(x, y, zoom)
            }
            if (!ySetR.has(y)) { // Has right neighbor?
                boundaries.addRightEdge(x, y, zoom)
            }
        }
    }
    return boundaries
}