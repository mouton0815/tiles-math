import { Coords } from './Coords'

/**
 * A rectangular geographical area on a map.
 * Can be passed to all Leaflet functions that accept Leaflet's LatLngBounds type.
 */
export type Bounds = [Coords, Coords]
