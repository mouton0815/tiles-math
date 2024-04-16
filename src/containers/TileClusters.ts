import { TileSet } from './TileSet'

/**
 * Three tile clusters computed by the {@link tiles2clusters} algorithm.
 */
export class TileClusters {
    allTiles: TileSet           // Reference to the tile set that was used as input for the clustering
    allClusters: Array<TileSet> // The array of different tile clusters (also see minorClusters and maxCluster)
    detachedTiles: TileSet      // Tiles detached from others (with up to three neighbors)
    minorClusters: TileSet      // Tiles with a neighbor on every side (which forms a cluster by definition)
    maxCluster: TileSet         // Tiles of the maximum cluster (the tile set with maximum size in allClusters)

    constructor(allTiles: TileSet) {
        const zoom = allTiles.getZoom()
        this.allTiles = allTiles
        this.allClusters = new Array<TileSet>()
        this.maxCluster = new TileSet(zoom)
        this.minorClusters = new TileSet(zoom)
        this.detachedTiles = new TileSet(zoom)
    }

    clone(): TileClusters {
        const cloned = new TileClusters(this.allTiles)
        return Object.assign(cloned, this)
    }
}
