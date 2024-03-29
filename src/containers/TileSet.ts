import { Tile } from '../types/Tile'
import { Centroid } from '../types/Centroid'
import { TileNo } from '../types/TileNo'
import { Coords } from '../types/Coords'
import { coords2tile } from '../algorithms/coords2tile'
import { TileRectangle } from '../types/TileRectangle'

/**
 * Helper class for tracking the number of tiles and summing up values fo centroid computation.
 */
class SetStats {
    private size: number
    private xSum: number
    private ySum: number
    constructor() {
        this.size = 0
        this.xSum = 0
        this.ySum = 0
    }
    addTile(x: number, y: number) {
        this.size++
        this.xSum += (x + 0.5) // Use the "center" of every tile to sum up the ...
        this.ySum += (y + 0.5) // ... cluster axes for later centroid calculation
    }
    getSize(): number {
        return this.size
    }
    getCentroid(zoom: number): Centroid | null {
        if (this.size === 0) {
            return null // Avoid division by 0
        }
        // Round to two decimal places (mainly for stable unit tests)
        const xCenter = Math.round(this.xSum / this.size * 100) / 100
        const yCenter = Math.round(this.ySum / this.size * 100) / 100
        return Centroid.of(xCenter, yCenter, zoom)
    }
}

/**
 * Helper class for bounding-box computation.
 */
class BoundingBox {
    private x1: number
    private y1: number
    private x2: number
    private y2: number
    constructor() {
        this.x1 = Number.MAX_SAFE_INTEGER
        this.y1 = Number.MAX_SAFE_INTEGER
        this.x2 = Number.MIN_SAFE_INTEGER
        this.y2 = Number.MIN_SAFE_INTEGER
    }
    addTile(x: number, y: number) {
        this.x1 = Math.min(x, this.x1)
        this.y1 = Math.min(y, this.y1)
        this.x2 = Math.max(x, this.x2)
        this.y2 = Math.max(y, this.y2)
    }
    isLeftOf(x: number): boolean {
        return this.x2 + 1 < x
    }
    getRectangle(margin: number, zoom: number): TileRectangle | null {
        if (this.x1 === Number.MAX_SAFE_INTEGER) {
            return null // Cannot determine bounding box w/o tiles in the set
        }
        return new TileRectangle(this.x1 - margin, this.y1 - margin, this.x2 - this.x1 + 2 * margin + 1, this.y2 - this.y1 + 2 * margin + 1, zoom)
    }
}

/**
 * A set of {@link Tile}s stored as columns (x axis) and rows (y axis).
 */
export class TileSet {
    static readonly EMPTY_SET = new Set<number>()

    private readonly tiles: Map<number, Set<number>> // Access-optimized tile storage: Map<x, Set<y>>
    private readonly zoom: number // Zoom factor for all tiles in the set
    private readonly stats: SetStats
    private readonly bounds: BoundingBox

    /**
     * Constructs a {@TileSet} object for the given zoom level.
     * @param {number} zoom - The {@link Tile} zoom level (often 14).
     */
    constructor(zoom: number) {
        this.tiles = new Map<number, Set<number>>()
        this.zoom = zoom
        this.stats = new SetStats()
        this.bounds = new BoundingBox()
    }

    /**
     * Creates a shallow copy of the passed {@link TileSet}.
     * This is useful for React's useState effect that tests for object identity.
     * @returns a shallow copy of this object.
     */
    clone(): TileSet {
        const cloned = new TileSet(this.zoom)
        Object.assign(cloned, this)
        return cloned
    }

    /**
     * Adds a {@link TileNo} and returns this {@link TileSet} object. Duplicate tiles are ignored.
     * @param {TileNo} tileNo - A tile to add.
     * @returns true if the tile has been added, false otherwise.
     */
    addTile({ x, y }: TileNo): boolean {
        let ySet = this.tiles.get(x)
        if (!ySet) {
           ySet = new Set<number>()
        } else if (ySet.has(y)) {
            return false // Duplicate tile
        }
        ySet.add(y)
        this.tiles.set(x, ySet)
        this.stats.addTile(x, y)
        this.bounds.addTile(x, y)
        return true
    }

    /**
     * Adds a sequence of {@link TileNo}s and returns this {@link TileSet} object.
     * @param {Iterable<TileNo>} tiles - an iterable object, for example an Array<TileNo>.
     * @returns this object.
     */
    addTiles(tiles: Iterable<TileNo>): this {
        for (const tile of tiles) {
            this.addTile(tile)
        }
        return this
    }

    /**
     * Adds a sequence of {@link Coords} and returns this {@link TileSet} object.
     * @param {Iterable<Coords>} coords - an iterable object, for example an Array<TileNo>.
     * @returns this object.
     */
    addCoords(coords: Iterable<Coords>): this {
        for (const coord of coords) {
            this.addTile(coords2tile(coord, this.zoom))
        }
        return this
    }

    /**
     * Checks whether this {@TileSet} contains the given tile.
     * @param {TileNo} tile - the tile to check for containment.
     * @returns true if the {@TileSet} contains the given tile, false otherwise.
     */
    has(tile: TileNo): boolean {
        const ySet = this.tiles.get(tile.x)
        return !!ySet && ySet.has(tile.y)
    }

    /**
     * Merges the other {@link TileSet} into this TileSet. Duplicates are ignored.
     * @param {TileSet} other - the tile set to be merged into this tile set.
     * @returns this object.
     */
    merge(other: TileSet): this {
        if (this.zoom !== other.zoom) {
            throw new Error('Cannot merge tile sets of different zoom levels')
        }
        other.tiles.forEach((yset, x) => {
            yset.forEach(y => this.addTile({ x, y }))
        })
        return this
    }

    /**
     * Merges the other {@link TileSet} into this TileSet. Duplicates are ignored.
     * In addition to the {@link merge} method, this method returns all tiles that were indeed inserted.
     * Mathematically, this is the set difference of the other and this TileSet.
     * @param {TileSet} other - the tile set to be merged into this tile set.
     * @returns the set of inserted tiles.
     */
    mergeDiff(other: TileSet): TileSet {
        if (this.zoom !== other.zoom) {
            throw new Error('Cannot merge tile sets of different zoom levels')
        }
        const delta = new TileSet(this.zoom)
        other.tiles.forEach((yset, x) => {
            yset.forEach(y => {
                const tile = { x, y }
                if (this.addTile(tile)) {
                    delta.addTile(tile)
                }
            })
        })
        return delta
    }

    /**
     * Returns true iff the passed {@link TileNo} has at least one neighbor (upper, lower, left, or right).
     * @param {TileNo} tile - the tile to check for neighborhood.
     * @returns true if this set has a tile that is a direct neighbor of the given tile, false otherwise.
     */
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

    /**
     * Returns true iff the passed {@link TileNo} has four neighbors (upper, lower, left, and right).
     * @param {TileNo} tile - the tile to check for neighborhood.
     * @returns true if this set has tiles that are direct neighbors of the given tile, false otherwise.
     */
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

    /**
     * Returns true iff all tiles of this set are to the left of x (there is a gap of one tile minimum).
     */
    isLeftOf(x: number): boolean {
        return this.bounds.isLeftOf(x)
    }

    /**
     * Returns the number of tiles in this set.
     */
    getSize(): number {
        return this.stats.getSize()
    }

    /**
     * Returns the zoom level of the tiles in this set.
     */
    getZoom(): number {
        return this.zoom
    }

    /**
     * Returns the {@link Centroid} (https://en.wikipedia.org/wiki/Centroid) tile of this {@link TileSet}.
     * For every tile, its center is used, that is, tile.x + 0.5 and tile.y + 0.5.
     * @returns the centroid of this tile set.
     */
    centroid(): Centroid | null {
        return this.stats.getCentroid(this.zoom)
    }

    /**
     * Returns the bounding box of this {@link TileSet}.
     * This is useful for getting the map boundaries by calling {@link TileRectangle.bounds}.
     * @param margin - number of tiles to add as extra margin
     */
    boundingBox(margin: number = 0): TileRectangle | null {
        return this.bounds.getRectangle(margin, this.zoom)
    }

    /**
     * Similar to Array.map() function.
     */
    map<T>(callback: (tile: Tile, index: number) => T): Array<T> {
        let index = 0
        const results = new Array<T>()
        for (const tile of this) { // Use *[Symbol.iterator]()
            results.push(callback(tile, index++))
        }
        return results
    }

    /**
     * Returns the set of y coordinates of all tiles with the passed x coordinate.
     * The returned set may be empty, but never undefined or null.
     * @param {number} x - the x coordinate.
     * @returns the set of y coordinates of tiles with the given x coordinate.
     */
    getYSet(x: number): Set<number> {
        return this.tiles.get(x) || TileSet.EMPTY_SET
    }

    /**
     * Returns all x coordinates of this {@link TileSet} in ascending order.
     * @returns the set of x coordinates of all stored tiles in ascending order.
     */
    getSortedXs(): Array<number> {
        return Array.from(this.tiles.keys()).toSorted()
    }

    /**
     * Returns the array of y coordinates of all tiles with the passed x coordinate in ascending order.
     * The returned array may be empty, but never undefined or null.
     * @param {number} x - the x coordinate.
     * @returns the array of y coordinates of tiles with the given x coordinate in ascending order.
     */
    getSortedYs(x: number): Array<number> {
        return Array.from(this.tiles.get(x) || TileSet.EMPTY_SET).toSorted()
    }

    /**
     * Convenience function.
     */
    toArray(): Array<Tile> {
        return [...this] // Use *[Symbol.iterator]()
    }

    /**
     * Iterates through the tiles in insertion order.
     * @returns the yielded {@link Tile}.
     */
    *[Symbol.iterator]() : Generator<Tile, void, undefined> {
        for (const [x, ySet] of this.tiles) {
            for (const y of ySet) {
                yield Tile.of(x, y, this.zoom)
            }
        }
    }
}
