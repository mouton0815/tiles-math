import { TileSet } from './TileSet'

/**
 * Three tile clusters computed by the {@link tiles2clusters} algorithm.
 */
export type TileClusters = {
    readonly detachedTiles: TileSet, // Tiles detached from others (with up to three neighbors)
    readonly minorClusters: TileSet, // Tiles with a neighbor on every side (which forms a cluster by definition)
    readonly maxCluster: TileSet     // Tiles of the maximum cluster
    readonly maxClusterEx: TileSet   // Tiles of the maximum cluster including their direct neighbors (useful for max-square calculation)
}
