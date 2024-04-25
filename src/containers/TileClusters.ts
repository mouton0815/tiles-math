import { TileSet } from './TileSet'

/**
 * Three tile clusters computed by the {@link tiles2clusters} algorithm.
 */
export class TileClusters {
    allTiles: TileSet           // Reference to the tile set that was used as input for the clustering
    newTiles: TileSet           // The set of tiles actually added to allTiles in the current clustering step
    allClusters: Array<TileSet> // The array of different tile clusters (also see minorClusters and maxCluster)
    detachedTiles: TileSet      // Tiles detached from others (with up to three neighbors)
    minorClusters: TileSet      // Tiles with a neighbor on every side (which forms a cluster by definition)
    maxCluster: TileSet         // Tiles of the maximum cluster (the tile set with maximum size in allClusters)

    constructor(tiles: TileSet, prevClusters?: TileClusters) {
        if (prevClusters) {
            this.allTiles = prevClusters.allTiles
            this.newTiles = prevClusters.allTiles.mergeDiff(tiles)
            this.allClusters = prevClusters.allClusters
            this.detachedTiles = prevClusters.detachedTiles
            this.minorClusters = prevClusters.minorClusters
            this.maxCluster = prevClusters.maxCluster
        } else {
            this.allTiles = tiles
            this.newTiles = tiles
            this.allClusters = new Array<TileSet>()
            const zoom = tiles.getZoom()
            this.detachedTiles = new TileSet(zoom)
            this.minorClusters = new TileSet(zoom)
            this.maxCluster = new TileSet(zoom)
        }
    }
}
