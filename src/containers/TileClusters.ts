import { TileSet } from './TileSet'

/**
 * Three tile clusters computed by the {@link tiles2clusters} algorithm.
 */
export type TileClusters = {
    detachedTiles: TileSet, // Tiles detached from others (with up to three neighbors)
    minorClusters: TileSet, // Tiles with a neighbor on every side (which forms a cluster by definition)
    maxCluster: TileSet     // Tiles of the maximum cluster
}
