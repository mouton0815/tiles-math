import { TileSet } from '../containers/TileSet'
import { ClusterBoundaries } from '../containers/ClusterBoundaries'

export function cluster2boundaries(cluster: TileSet): ClusterBoundaries {
    const boundaries = new ClusterBoundaries()
    for (const x of cluster.getSortedXs()) {
        const ySet = cluster.tiles.get(x) // TODO: Illegal access
        for (const y of cluster.getSortedYs(x)) {
            // Check for neighbors counterclockwise
            if (!ySet || !ySet.has(y - 1)) { // Upper neighbor? // TODO: Could be checked via array index - 1
                boundaries.addUpperEdge(x, y)
            }
            const ySetLeft = cluster.tiles.get(x - 1)
            if (!ySetLeft || !ySetLeft.has(y)) { // Left neighbor?
                boundaries.addLeftEdge(x, y)
            }
            if (!ySet || !ySet.has(y + 1)) { // Lower neighbor? // TODO: Could be checked via array index + 1
                boundaries.addLowerEdge(x, y)
            }
            const ySetRight = cluster.tiles.get(x + 1)
            if (!ySetRight || !ySetRight.has(y)) { // Right neighbor?
                boundaries.addRightEdge(x, y)
            }
        }
    }
    return boundaries
}