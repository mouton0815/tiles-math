import { coords2tile } from '../coords2tile'
import { tile2coords } from '../tile2coords'

//
// Reference: https://chrishewett.com/blog/slippy-tile-explorer
//

// Jena city center tile inner coord and edge coords
const zoom = 14
const jena_lat_n = 50.930738023718185
const jena_lat_s = 50.91688748924508 // should be ...4507 but that might hit the precision limits
const jena_lon_w = 11.57958984375
const jena_lon_e = 11.6015624999999
const delta = 0.000000000001
const jena_x = 8719
const jena_y = 5490

test('coords2tile-jena-c-inner', () => {
    const tile = coords2tile([(jena_lat_n + jena_lat_s) / 2, (jena_lon_w + jena_lon_e) / 2], zoom)
    expect(tile).toEqual({ x: jena_x, y: jena_y })
})

test('coords2tile-jena-c-nw', () => {
    const tile = coords2tile([jena_lat_n, jena_lon_w], zoom)
    expect(tile).toEqual({ x: jena_x, y: jena_y })
    const coords = tile2coords(tile.x, tile.y, zoom)  // Calculate ...
    expect(coords).toEqual([jena_lat_n, jena_lon_w]) // ... the inverse
})

test('coords2tile-jena-c-ne', () => {
    const tile = coords2tile([jena_lat_n, jena_lon_e], zoom)
    expect(tile).toEqual({ x: jena_x, y: jena_y })
})

test('coords2tile-jena-c-sw', () => {
    const tile = coords2tile([jena_lat_s, jena_lon_w], zoom)
    expect(tile).toEqual({ x: jena_x, y: jena_y })
})

test('coords2tile-jena-c-se', () => {
    const tile = coords2tile([jena_lat_s, jena_lon_e], zoom)
    expect(tile).toEqual({ x: jena_x, y: jena_y })
})

// Jena tiles around center tile

test('coords2tile-jena-n-sw', () => {
    const tile = coords2tile([jena_lat_n + delta, jena_lon_w], zoom)
    expect(tile).toEqual({ x: jena_x, y: jena_y - 1 })
})

test('coords2tile-jena-w-ne', () => {
    const tile = coords2tile([jena_lat_n, jena_lon_w - delta], zoom)
    expect(tile).toEqual({ x: jena_x - 1, y: jena_y })
})

test('coords2tile-jena-s-nw', () => {
    const tile = coords2tile([jena_lat_s - delta, jena_lon_w], zoom)
    expect(tile).toEqual({ x: jena_x, y: jena_y + 1 })
})

test('coords2tile-jena-e-nw', () => {
    const tile = coords2tile([jena_lat_n, jena_lon_e + delta], zoom)
    expect(tile).toEqual({ x: jena_x + 1, y: jena_y })
})

// Zero coordinate
test('coords2tile-zero', () => {
    const tile = coords2tile([0, 0], zoom)
    expect(tile).toEqual({ x: 8192, y: 8192 })
    const coords = tile2coords(tile.x, tile.y, zoom)
    expect(coords).toEqual([0, 0])
})


