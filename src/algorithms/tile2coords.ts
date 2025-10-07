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
    return [y2lat(y, zoom), x2lon(x, zoom)]
}

/**
 * Calculates the latitude of a tile given its y position and zoom level
 * @param y - the y coordinate of a tile
 * @param zoom the map zoom level
 * @returns the corresponding latitude
 */
export function y2lat(y: number, zoom: number): number {
    const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, zoom)
    return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))
}

/**
 * Calculates the longitude of a tile given its x position and zoom level
 * @param x - the x coordinate of a tile
 * @param zoom the map zoom level
 * @returns the corresponding longitude
 */
export function x2lon(x: number, zoom: number): number {
    return (x / Math.pow(2, zoom)) * 360 - 180
}