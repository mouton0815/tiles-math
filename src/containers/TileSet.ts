import { Tile } from '../types/Tile'
import { Centroid } from '../types/Centroid'

///
/// A set of {@link Tile}s stored as columns (x axis) and rows (y axis).
///
// TODO: Use key-sorted Set and Map (and get rid of "toSorted" methods
export class TileSet {
    static EMPTY_SET = new Set<number>()

    tiles: Map<number, Set<number>> // Access-optimized tile storage: Map<x, Set<y>>
    size: number // Number of tiles in this set
    xSum: number // For calculation ...
    ySum: number // ... of centroid

    /// Constructor optionally initializes the map from another map (shallow copy).
    /// This is useful for React's useState effect that tests for object identity.
    constructor(other?: TileSet) {
        if (other) {
            this.tiles = other.tiles
            this.size = other.size
            this.xSum = other.xSum
            this.ySum = other.ySum
        } else {
            this.tiles = new Map<number, Set<number>>()
            this.size = 0
            this.xSum = 0
            this.ySum = 0
        }
    }

    /// Adds a tile and returns the TileMap object.
    /// Duplicate tiles are ignored.
    add(tile: Tile): this {
        let ySet = this.tiles.get(tile.x)
        if (!ySet) {
           ySet = new Set<number>()
        } else if (ySet.has(tile.y)) {
            return this // Duplicate tile
        }
        ySet.add(tile.y)
        this.tiles.set(tile.x, ySet)
        this.xSum += (tile.x + 0.5) // Use the "center" of every tile to sum up the ...
        this.ySum += (tile.y + 0.5) // ... cluster axes for later centroid calculation
        this.size++
        return this
    }

    /// Adds a sequence of tile and returns the TileMap object
    addAll(tiles: Iterable<Tile>): this {
        for (const tile of tiles) {
            this.add(tile)
        }
        return this
    }

    /// Checks it this map contains the tile
    has(tile: Tile): boolean {
        const ySet = this.tiles.get(tile.x)
        return !!ySet && ySet.has(tile.y)
    }

    /// Merges the other TileMap into this TileMap
    merge(other: TileSet): this {
        other.tiles.forEach((yset, x) => {
            yset.forEach(y => this.add(Tile.of(x, y)))
        })
        return this
        /*
        for (const [x, otherYSet] of other.map.entries()) {
            const thisYSet = this.map.get(x)
            if (thisYSet) {
                otherYSet.forEach(y => thisYSet.add(y))
            } else {
                this.map.set(x, otherYSet)
            }
        }
        */
    }

    /// Returns true iff the tile has one neighbor
    hasNeighbor(tile: Tile): boolean {
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
    hasNeighbors(tile: Tile): boolean {
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
        return Centroid.of(xCenter, yCenter)
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

    /// Selects all tiles with no left neighbor and applies the callback function
    // TODO: Deprecated
    mapLeft<T>(callback: (tile: Tile, index: number) => T): Array<T> {
        let index = 0
        const results = new Array<T>()
        for (const [x, ySet] of this.tiles) {
            const leftYSet = this.tiles.get(x - 1)
            for (const y of ySet) {
                if (!leftYSet || !leftYSet.has(y)) {
                    results.push(callback(Tile.of(x, y), index++))
                }
            }
        }
        return results
    }

    /// Selects all tiles with no right neighbor and applies the callback function
    // TODO: Deprecated
    mapRight<T>(callback: (tile: Tile, index: number) => T): Array<T> {
        let index = 0
        const results = new Array<T>()
        for (const [x, ySet] of this.tiles) {
            const rightYSet = this.tiles.get(x + 1)
            for (const y of ySet) {
                if (!rightYSet || !rightYSet.has(y)) {
                    results.push(callback(Tile.of(x, y), index++))
                }
            }
        }
        return results
    }

    /// Selects all tiles with no neighbor above and applies the callback function
    // TODO: Deprecated
    mapAbove<T>(callback: (tile: Tile, index: number) => T): Array<T> {
        let index = 0
        const results = new Array<T>()
        for (const [x, ySet] of this.tiles) {
            for (const y of ySet) {
                if (!ySet.has(y - 1)) {
                    results.push(callback(Tile.of(x, y), index++))
                }
            }
        }
        return results
    }

    /// Selects all tiles with no neighbor below and applies the callback function
    // TODO: Deprecated
    mapBelow<T>(callback: (tile: Tile, index: number) => T): Array<T> {
        let index = 0
        const results = new Array<T>()
        for (const [x, ySet] of this.tiles) {
            for (const y of ySet) {
                if (!ySet.has(y + 1)) {
                    results.push(callback(Tile.of(x, y), index++))
                }
            }
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
        for (const [x, ySet] of this.tiles) {
            for (const y of ySet) {
                yield Tile.of(x, y)
            }
        }
    }
}
