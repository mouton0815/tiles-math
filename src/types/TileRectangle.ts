import { Bounds } from './Bounds'
import { Centroid } from './Centroid'
import { TileSquare } from './TileSquare'
import { tile2coords } from '../algorithms/tile2coords'

///
/// A rectangle of tiles.
///
export class TileRectangle {
    x: number // x coordinate of the tile in the upper-left rectangle corner
    y: number // y coordinate of the tile in the upper-left rectangle corner
    w: number // number of horizontal tiles in this rectangle
    h: number // number of vertical tiles in this rectangle
    z: number // zoom level of contained tiles

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

    equals(other: TileRectangle): boolean {
        return this.x === other.x && this.y === other.y && this.w === other.w && this.h === other.h && this.z === other.z
    }

    contains(other: TileRectangle): boolean {
        return this.z === other.z && this.x <= other.x && this.y <= other.y && this.x + this.w >= other.x + other.w && this.y + this.h >= other.y + other.h
    }

    stronglyContains(other: TileRectangle): boolean {
        return this.contains(other) && (this.x < other.x || this.y < other.y || this.x + this.w > other.x + other.w || this.y + this.h > other.y + other.h)
    }

    /// Calculates the centroid of the rectangle
    centroid(): Centroid {
        return Centroid.of((2 * this.x + this.w) / 2, (2 * this.y + this.h) / 2)
    }

    /// Iterates through all embedded squares with the same side length as the shorter rectangle side
    *squares() {
        if (this.w >= this.h) {
            for (let i = 0; i <= this.w - this.h; ++i) {
                yield TileSquare.of(this.x + i, this.y, this.h)
            }
        } else {
            for (let i = 0; i <= this.h - this.w; ++i) {
                yield TileSquare.of(this.x, this.y + i, this.w)
            }
        }
    }

    /// Bounding box of this rectangle given a zoom level
    bounds(): Bounds {
        return [tile2coords(this.x, this.y, this.z), tile2coords(this.x + this.w, this.y + this.h, this.z)]
    }
}
