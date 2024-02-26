import { Tile } from '../types/Tile'
import { Centroid } from '../types/Centroid'
import { TileNo } from '../types/TileNo'
import { Coords } from '../types/Coords'
import { coords2tile } from '../algorithms/coords2tile'

///
/// A set of {@link Tile}s stored as columns (x axis) and rows (y axis).
///
// TODO: Use key-sorted Set and Map (and get rid of "toSorted" methods)
export class TileSet {
    static EMPTY_SET = new Set<number>()

    tiles: Map<number, Set<number>> // Access-optimized tile storage: Map<x, Set<y>>
    zoom: number // Zoom factor for all tiles in the set
    size: number // Number of tiles in this set
    xSum: number // For calculation ...
    ySum: number // ... of centroid

    /// Constructor.
    constructor(zoom: number) {
        this.tiles = new Map<number, Set<number>>()
        this.zoom = zoom
        this.size = 0
        this.xSum = 0
        this.ySum = 0
    }

    /// Creates a shallow copy of the passed tile set.
    /// This is useful for React's useState effect that tests for object identity.
    clone(): TileSet {
        const cloned = new TileSet(this.zoom)
        cloned.tiles = this.tiles
        cloned.size = this.size
        cloned.xSum = this.xSum
        cloned.ySum = this.ySum
        return cloned
    }

    /// Adds a {@link TileNo} and returns the TileSet object. Duplicate tiles are ignored.
    addTile({ x, y }: TileNo): this {
        let ySet = this.tiles.get(x)
        if (!ySet) {
           ySet = new Set<number>()
        } else if (ySet.has(y)) {
            return this // Duplicate tile
        }
        ySet.add(y)
        this.tiles.set(x, ySet)
        this.xSum += (x + 0.5) // Use the "center" of every tile to sum up the ...
        this.ySum += (y + 0.5) // ... cluster axes for later centroid calculation
        this.size++
        return this
    }

    /// Adds a sequence of {@link TileNo}s and returns the TileSet object
    addTiles(tiles: Iterable<TileNo>): this {
        for (const tile of tiles) {
            this.addTile(tile)
        }
        return this
    }

    /// Adds a sequence of {@link Coords}s and returns the TileSet object
    addCoords(coords: Iterable<Coords>): this {
        for (const coord of coords) {
            this.addTile(coords2tile(coord, this.zoom))
        }
        return this
    }

    /// Checks it this map contains the tile
    has(tile: TileNo): boolean {
        const ySet = this.tiles.get(tile.x)
        return !!ySet && ySet.has(tile.y)
    }

    /// Merges the other TileSet into this TileSet
    merge(other: TileSet): this {
        if (this.zoom !== other.zoom) {
            throw new Error('Cannot merge tile sets of different zoom levels')
        }
        other.tiles.forEach((yset, x) => {
            yset.forEach(y => this.addTile({ x, y }))
        })
        return this
    }

    /// Returns true iff the tile has one neighbor
    hasNeighbor(tile: TileNo): boolean {
        // Upper or lower neighbor
        let ySet = this.tiles.get(tile.x)
        if (ySet && (ySet.has(tile.y - 1) || ySet.has(tile.y + 1))) {
            return true
        }
        // Left neighbor
        ySet = this.tiles.get(tile.x - 1)
        if (ySet && ySet.has(tile.y)) {
            return true
        }
        // Right neighbor
        ySet = this.tiles.get(tile.x + 1)
        return !!ySet && ySet.has(tile.y)
    }

    /// Returns true iff the tile has four neighbors.
    /// If true, this tile belongs to a cluster or forms a new one.
    hasNeighbors(tile: TileNo): boolean {
        // Upper and lower neighbor
        let ySet = this.tiles.get(tile.x)
        if (!ySet || !ySet.has(tile.y - 1) || !ySet.has(tile.y + 1)) {
            return false
        }
        // Left neighbor
        ySet = this.tiles.get(tile.x - 1)
        if (!ySet || !ySet.has(tile.y)) {
            return false
        }
        // Right neighbor
        ySet = this.tiles.get(tile.x + 1)
        return !!ySet && ySet.has(tile.y)
    }

    /// Returns the centroid (https://en.wikipedia.org/wiki/Centroid) tile of this tile cluster.
    /// For every tile, its center is used, that is, tile.x + 0.5 and tile.y + 0.5
    centroid(): Centroid | null {
        if (this.size === 0) {
            return null // Avoid division by 0
        }
        // Round to two decimal places (mainly for stable unit tests)
        const xCenter = Math.round(this.xSum / this.size * 100) / 100
        const yCenter = Math.round(this.ySum / this.size * 100) / 100
        return Centroid.of(xCenter, yCenter, this.zoom || 0) // zoom is always defined if set is non-empty
    }

    /// Similar to Array.map() function
    map<T>(callback: (tile: Tile, index: number) => T): Array<T> {
        let index = 0
        const results = new Array<T>()
        for (const tile of this) { // Use *[Symbol.iterator]()
            results.push(callback(tile, index++))
        }
        return results
    }

    /// Returns the set of y coordinates of all tiles with the passed x coordinate.
    /// The returned set may be empty, but never undefined or null.
    getYSet(x: number): Set<number> {
        return this.tiles.get(x) || TileSet.EMPTY_SET
    }

    /// Returns all x coordinates of this map in ascending order
    getSortedXs(): Array<number> {
        return Array.from(this.tiles.keys()).toSorted()
    }

    /// Returns all y coordinates for x in ascending order
    getSortedYs(x: number): Array<number> {
        return Array.from(this.tiles.get(x) || TileSet.EMPTY_SET).toSorted()
    }

    /// Convenience function
    toArray(): Array<Tile> {
        return [...this] // Use *[Symbol.iterator]()
    }

    /// Iterates through the tiles in insertion order
    *[Symbol.iterator]() {
        const z = this.zoom || 0 // Note: this.zoom is non-null if iterator returns at least on tile
        for (const [x, ySet] of this.tiles) {
            for (const y of ySet) {
                yield Tile.of(x, y, z)
            }
        }
    }
}
