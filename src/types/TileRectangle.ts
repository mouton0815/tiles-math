import { Bounds } from './Bounds'
import { Centroid } from './Centroid'
import { TileSquare } from './TileSquare'
import { tile2coords } from '../algorithms/tile2coords'

/**
 * A rectangle of tiles.
 */
export class TileRectangle {
    x: number
    y: number
    w: number
    h: number
    z: number

    /**
     * Constructs a {@link TileRectangle} object.
     * @param x - the x coordinate of the tile in the upper-left rectangle corner.
     * @param y - the y coordinate of the tile in the upper-left rectangle corner
     * @param w - the number of horizontal tiles in this rectangle
     * @param h - the number of vertical tiles in this rectangle
     * @param z - the zoom level of contained tiles
     */
    constructor(x: number, y: number, w: number, h: number, z: number) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.z = z
    }

    static of(x: number, y: number, w: number, h: number, z: number): TileRectangle {
        return new TileRectangle(x, y, w, h, z)
    }

    /**
     * Checks whether the other rectangle has the same position and size as this rectangle.
     * @param other - the rectangle to compare
     * @returns true if both rectangles are equal, false otherwise
     */
    equals(other: TileRectangle): boolean {
        return this.x === other.x && this.y === other.y && this.w === other.w && this.h === other.h && this.z === other.z
    }

    /**
     * Checks whether this rectangle contains the other rectangle (which includes equality).
     * @param other - the rectangle to check for containment
     * @returns true if this rectangle contains the other rectangle, false otherwise
     */
    contains(other: TileRectangle): boolean {
        return this.z === other.z && this.x <= other.x && this.y <= other.y && this.x + this.w >= other.x + other.w && this.y + this.h >= other.y + other.h
    }

    /**
     * Checks whether this rectangle contains the other rectangle (and is not equal).
     * @param other - the rectangle to check for containment
     * @returns true if this rectangle strongly contains the other rectangle, false otherwise
     */
    stronglyContains(other: TileRectangle): boolean {
        return this.contains(other) && (this.x < other.x || this.y < other.y || this.x + this.w > other.x + other.w || this.y + this.h > other.y + other.h)
    }

    /**
     * Calculates the {@link Centroid} of this rectangle.
     * @returns the centroid
     */
    centroid(): Centroid {
        return Centroid.of((2 * this.x + this.w) / 2, (2 * this.y + this.h) / 2, this.z)
    }

    /**
     * Iterates through all embedded squares with the same side length as the shorter rectangle side.
     * @returns the yielded {@link TileSquare}.
     */
    *squares() : Generator<TileSquare, void, undefined> {
        if (this.w >= this.h) {
            for (let i = 0; i <= this.w - this.h; ++i) {
                yield TileSquare.of(this.x + i, this.y, this.h, this.z)
            }
        } else {
            for (let i = 0; i <= this.h - this.w; ++i) {
                yield TileSquare.of(this.x, this.y + i, this.w, this.z)
            }
        }
    }

    /**
     * Computes the bounding box of this rectangle given a zoom level.
     * @returns the bounding box
     */
    bounds(): Bounds {
        return [tile2coords(this.x, this.y, this.z), tile2coords(this.x + this.w, this.y + this.h, this.z)]
    }
}
