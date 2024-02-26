import { Coords } from './Coords'
import { tile2coords } from '../algorithms/tile2coords'

///
/// A point with fractional numbers used for representing centroid in the tiles "coordinate system".
///
export class Centroid {
    x: number
    y: number
    z: number // zoom

    constructor(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
    }

    static of(x: number, y: number, z: number): Centroid {
        return new Centroid(x, y, z)
    }

    position(): Coords {
        return tile2coords(this.x, this.y, this.z)
    }
}
