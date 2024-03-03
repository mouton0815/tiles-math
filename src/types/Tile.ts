import { Bounds } from './Bounds'
import { tile2coords } from '../algorithms/tile2coords'
import { TileNo } from './TileNo'

/**
 * A map tile compatible with the conventions of https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames.
 */
export class Tile implements TileNo {
    x: number
    y: number
    z: number // Zoom

    /**
     * Constructs a {@link Tile}.
     * @param {number} x - the x "coordinate" of the tile (x goes from 0 to 2^z − 1).
     * @param {number} y - the y "coordinate" of the tile (y goes from 0 to 2^z − 1).
     * @param {number} z - the zoom level of the tile (14 is a usual value).
     */
    constructor(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
    }

    static of(x: number, y: number, z: number): Tile {
        return new Tile(x, y, z)
    }

    /**
     * Returns the bounding box of this tile.
     * The bounding box can be displayed e.g. as a Leaflet rectangle.
     * @returns the bounding box of this tile.
     */
    bounds(): Bounds {
        return [tile2coords(this.x, this.y, this.z), tile2coords(this.x + 1, this.y + 1, this.z)]
    }
}
