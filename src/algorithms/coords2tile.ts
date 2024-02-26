import { Coords } from '../types/Coords'
import { TileNo } from '../types/TileNo'

///
/// Calculates the x,y part of a tile name (see https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames)
/// from a {@link Coords} pair plus zoom level, and creates a {@link Tile} object.
///
export function coords2tile([lat, lon]: Coords, zoom: number): TileNo {
    const zPow = 1 << zoom // Math.pow(2, zoom)
    const latRad = (lat * Math.PI) / 180
    const x = Math.floor(((lon + 180) / 360) * zPow)
    const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * zPow)
    return { x, y }
}
