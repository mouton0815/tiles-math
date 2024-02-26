import { Bounds } from './Bounds'
import { tile2coords } from '../algorithms/tile2coords'
import { TileNo } from './TileNo'

///
/// A map tile compatible with the conventions of https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames.
///
export class Tile implements TileNo {
    x: number
    y: number
    z: number // Zoom

    constructor(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
    }

    static of(x: number, y: number, z: number): Tile {
        return new Tile(x, y, z)
    }

    /// Bounding box of this tile.
    bounds(): Bounds {
        return [tile2coords(this.x, this.y, this.z), tile2coords(this.x + 1, this.y + 1, this.z)]
    }
}
