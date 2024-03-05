import { Coords } from './Coords'
import { tile2coords } from '../algorithms/tile2coords'

/**
 * A point with fractional numbers used for representing centroid in the tiles "coordinate system".
 */
export class Centroid {
    readonly x: number
    readonly y: number
    readonly z: number // zoom

    /**
     * Constructs a {@link Centroid}.
     * @param {number} x - the x "coordinate" of the centroid (can be a fraction number).
     * @param {number} y - the y "coordinate" of the centroid (can be a fraction number).
     * @param {number} z - the zoom level of the centroid (14 is a usual value).
     */
    constructor(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
    }

    static of(x: number, y: number, z: number): Centroid {
        return new Centroid(x, y, z)
    }

    /**
     * Returns the coordinates (latitude, longitude) of this centroid.
     * The coordinates box can be displayed e.g. as a Leaflet circle.
     * @returns the coordinates of this centroid.
     */
    position(): Coords {
        return tile2coords(this.x, this.y, this.z)
    }
}
