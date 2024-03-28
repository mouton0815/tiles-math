import { TileSet } from './TileSet'
import { TileNo } from '../types/TileNo'

// TODO: Remove this. Can be done by TileSet / Margin
export class Cluster {
    tiles: TileSet
    private marginRight: number
    constructor(tile: TileNo, zoom: number) {
        this.tiles = new TileSet(zoom).addTile(tile)
        this.marginRight = tile.x + 1
    }
    addTile(tile: TileNo) {
        this.tiles.addTile(tile)
        this.marginRight = Math.max(this.marginRight, tile.x + 1)
    }
    isLeftOf(x: number): boolean {
        return this.marginRight < x
    }
    merge(other: Cluster) {
        for (const tile of other.tiles) {
            this.addTile(tile)
        }
    }
}

/**
 * Three tile clusters computed by the {@link tiles2clusters} algorithm.
 */
export type TileClusters = {
    allTiles: TileSet,      // Reference to the tile set that was used as input for the clustering
    allClusters: Array<Cluster>, // TODO: Document
    detachedTiles: TileSet, // Tiles detached from others (with up to three neighbors)
    minorClusters: TileSet, // Tiles with a neighbor on every side (which forms a cluster by definition)
    maxCluster: TileSet     // Tiles of the maximum cluster
}
