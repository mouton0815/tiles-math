import { Bounds } from './Bounds'
import { Centroid } from './Centroid'
import { tile2coords } from '../algorithms/tile2coords'

///
/// A square of tiles.
///
export class TileSquare {
    x: number // x coordinate of the tile in the upper-left square corner
    y: number // y coordinate of the tile in the upper-left square corner
    s: number // number of tiles per square side
    z: number // zoom level of contained tiles

    constructor(x: number, y: number, s: number, z: number) {
        this.x = x
        this.y = y
        this.s = s
        this.z = z
    }

    static of(x: number, y: number, s: number, z: number): TileSquare {
        return new TileSquare(x, y, s, z)
    }

    equals(other: TileSquare): boolean {
        return this.x === other.x && this.y === other.y && this.s === other.s && this.z === other.z
    }

    /// Calculates the centroid of the square
    centroid(): Centroid {
        return Centroid.of((2 * this.x + this.s) / 2, (2 * this.y + this.s) / 2)
    }

    /// Returns the Euclidean distance from the centroid of this square to the given point
    distanceTo({ x, y }: Centroid): number {
        const xCenter = (2 * this.x + this.s) / 2
        const yCenter = (2 * this.y + this.s) / 2
        return Math.sqrt(Math.pow(xCenter - x, 2) + Math.pow(yCenter - y, 2))
    }

    /// Bounding box of this square.
    bounds(): Bounds {
        return [tile2coords(this.x, this.y, this.z), tile2coords(this.x + this.s, this.y + this.s, this.z)]
    }
}