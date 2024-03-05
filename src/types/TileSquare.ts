import { Bounds } from './Bounds'
import { Centroid } from './Centroid'
import { tile2coords } from '../algorithms/tile2coords'

/**
 * A square of tiles.
 */
export class TileSquare {
    readonly x: number
    readonly y: number
    readonly s: number
    readonly z: number

    /**
     * Constructs a {@link TileSquare} object.
     * @param x - the x coordinate of the tile in the upper-left square corner.
     * @param y - the y coordinate of the tile in the upper-left square corner.
     * @param s - the number of tiles per square side.
     * @param z - the zoom level of contained tiles.
     */
    constructor(x: number, y: number, s: number, z: number) {
        this.x = x
        this.y = y
        this.s = s
        this.z = z
    }

    static of(x: number, y: number, s: number, z: number): TileSquare {
        return new TileSquare(x, y, s, z)
    }

    /**
     * Checks whether the other square has the same position and size as this square.
     * @param other - the square to compare.
     * @returns true if both squares are equal, false otherwise.
     */
    equals(other: TileSquare): boolean {
        return this.x === other.x && this.y === other.y && this.s === other.s && this.z === other.z
    }

    /**
     * Calculates the {@link Centroid} of this square.
     * @returns the centroid.
     */
    centroid(): Centroid {
        return Centroid.of((2 * this.x + this.s) / 2, (2 * this.y + this.s) / 2, this.z)
    }

    /**
     * Returns the Euclidean distance from the {@link Centroid} of this square to the centroid passed as parameter.
     * @param x - the x coordinate of the other centroid.
     * @param y - the y coordinate of the other centroid.
     * @returns the computed distance.
     */
    distanceTo({ x, y }: Centroid): number {
        const xCenter = (2 * this.x + this.s) / 2
        const yCenter = (2 * this.y + this.s) / 2
        return Math.sqrt(Math.pow(xCenter - x, 2) + Math.pow(yCenter - y, 2))
    }

    /**
     * Computes the bounding box of this square given a zoom level.
     * @returns the bounding box.
     */
    bounds(): Bounds {
        return [tile2coords(this.x, this.y, this.z), tile2coords(this.x + this.s, this.y + this.s, this.z)]
    }
}