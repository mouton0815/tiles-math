import { Coords } from './Coords'
import { tile2coords } from '../algorithms/tile2coords'

/// A point with fractional numbers used for representing centroid in the tiles "coordinate system".
export class Centroid {
    x: number
    y: number
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
    static of(x: number, y: number): Centroid {
        return new Centroid(x, y)
    }
    position(zoom: number): Coords {
        return tile2coords(this.x, this.y, zoom)
    }
}
