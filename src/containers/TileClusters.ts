import { TileSet } from './TileSet'

/// Three clusters computed by the {@link tiles2clusters} algorithm.
export type TileClusters = {
    detached: TileSet,   // Tiles detached from others (with up to three neighbors)
    surrounded: TileSet, // Tiles with a neighbor on every side
    maxCluster: TileSet  // Tiles of the maximum cluster
}
