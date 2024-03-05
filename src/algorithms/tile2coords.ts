import { Coords } from '../types/Coords'

/**
 * Calculates the map {@link Coords} of a tile given its name (x, y, zoom level)
 * as specified at https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames.
 * @param x - the x coordinate of a tile
 * @param y - the y coordinate of a tile
 * @param zoom the map zoom level
 * @returns the corresponding map coordinates
 */
export function tile2coords(x: number, y: number, zoom: number): Coords {
    const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, zoom)
    const lat =  (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))
    const lon = (x / Math.pow(2, zoom)) * 360 - 180
    return [lat, lon]
}
