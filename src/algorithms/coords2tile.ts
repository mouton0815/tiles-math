import { Coords } from '../types/Coords'
import { TileNo } from '../types/TileNo'

/**
 * Calculates the x,y part of a tile name (see https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames)
 * from a {@link Coords} pair plus zoom level, and creates a {@link TileNo} object.
 * @param lat - a latitude
 * @param lon - a longitude
 * @param zoom - a map zoom level
 * @returns the corresponding tile number
 */
export function coords2tile([lat, lon]: Coords, zoom: number): TileNo {
    return { x: lon2x(lon, zoom), y: lat2y(lat, zoom) }
}

/**
 * Calculates the y part of a tile from a latitude and zoom level.
 * @param lat - a latitude
 * @param zoom - a map zoom level
 * @returns the corresponding y position
 */
export function lat2y(lat: number, zoom: number): number {
    const latRad = (lat * Math.PI) / 180
    return Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * (1 << zoom))
}

/**
 * Calculates the x part of a tile from a longitude and zoom level.
 * @param lon - a longitude
 * @param zoom - a map zoom level
 * @returns the corresponding x position
 */
export function lon2x(lon: number, zoom: number): number {
    return Math.floor(((lon + 180) / 360) * (1 << zoom))
}
