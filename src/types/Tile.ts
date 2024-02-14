import { Bounds } from './Bounds'
import { tile2coords } from '../algorithms/tile2coords'

/// A map tile compatible with the conventions of https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames.
export class Tile  {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    static of(x: number, y: number): Tile {
        return new Tile(x, y)
    }

    /// Bounding box of this tile given a zoom level
    bounds(zoom: number): Bounds {
        return [tile2coords(this.x, this.y, zoom), tile2coords(this.x + 1, this.y + 1, zoom)]
    }

    /// Left boundary line of the tile
    leftLine(zoom: number): Bounds {
        return [tile2coords(this.x, this.y, zoom), tile2coords(this.x, this.y + 1, zoom)]
    }

    /// Right boundary line of the tile
    rightLine(zoom: number): Bounds {
        return [tile2coords(this.x + 1, this.y, zoom), tile2coords(this.x + 1, this.y + 1, zoom)]
    }

    /// Upper boundary line of the tile
    upperLine(zoom: number): Bounds {
        return [tile2coords(this.x, this.y, zoom), tile2coords(this.x + 1, this.y, zoom)]
    }

    /// Lower boundary line of the tile
    lowerLine(zoom: number): Bounds {
        return [tile2coords(this.x, this.y + 1, zoom), tile2coords(this.x + 1, this.y + 1, zoom)]
    }
}