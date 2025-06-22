import { coords2tile } from '../coords2tile'
import { tile2coords } from '../tile2coords'

//
// Reference: https://chrishewett.com/blog/slippy-tile-explorer
//

const ZOOM = 14

// Jena city center tile inner coord and edge coords
const JENA_LAT_N = 50.930738023718185
const JENA_LAT_S = 50.91688748924508 // should be ...4507 but that might hit the precision limits
const JENA_LON_W = 11.57958984375
const JENA_LON_E = 11.6015624999999
const DELTA = 0.000000000001
const JENA_X = 8719
const JENA_Y = 5490
// Zero coordinate
const ZERO_X = 8192
const ZERO_Y = 8192

test('coords2tile-jena-c-inner', () => {
    const tile = coords2tile([(JENA_LAT_N + JENA_LAT_S) / 2, (JENA_LON_W + JENA_LON_E) / 2], ZOOM)
    expect(tile).toEqual({ x: JENA_X, y: JENA_Y })
})

test('coords2tile-jena-c-nw', () => {
    const tile = coords2tile([JENA_LAT_N, JENA_LON_W], ZOOM)
    expect(tile).toEqual({ x: JENA_X, y: JENA_Y })
    const coords = tile2coords(tile.x, tile.y, ZOOM)  // Calculate ...
    expect(coords).toEqual([JENA_LAT_N, JENA_LON_W]) // ... the inverse
})

test('coords2tile-jena-c-ne', () => {
    const tile = coords2tile([JENA_LAT_N, JENA_LON_E], ZOOM)
    expect(tile).toEqual({ x: JENA_X, y: JENA_Y })
})

test('coords2tile-jena-c-sw', () => {
    const tile = coords2tile([JENA_LAT_S, JENA_LON_W], ZOOM)
    expect(tile).toEqual({ x: JENA_X, y: JENA_Y })
})

test('coords2tile-jena-c-se', () => {
    const tile = coords2tile([JENA_LAT_S, JENA_LON_E], ZOOM)
    expect(tile).toEqual({ x: JENA_X, y: JENA_Y })
})

// Jena tiles around center tile

test('coords2tile-jena-n-sw', () => {
    const tile = coords2tile([JENA_LAT_N + DELTA, JENA_LON_W], ZOOM)
    expect(tile).toEqual({ x: JENA_X, y: JENA_Y - 1 })
})

test('coords2tile-jena-w-ne', () => {
    const tile = coords2tile([JENA_LAT_N, JENA_LON_W - DELTA], ZOOM)
    expect(tile).toEqual({ x: JENA_X - 1, y: JENA_Y })
})

test('coords2tile-jena-s-nw', () => {
    const tile = coords2tile([JENA_LAT_S - DELTA, JENA_LON_W], ZOOM)
    expect(tile).toEqual({ x: JENA_X, y: JENA_Y + 1 })
})

test('coords2tile-jena-e-nw', () => {
    const tile = coords2tile([JENA_LAT_N, JENA_LON_E + DELTA], ZOOM)
    expect(tile).toEqual({ x: JENA_X + 1, y: JENA_Y })
})

// Zero coordinate
test('coords2tile-zero', () => {
    const tile = coords2tile([0, 0], ZOOM)
    expect(tile).toEqual({ x: ZERO_X, y: ZERO_Y })
    const coords = tile2coords(tile.x, tile.y, ZOOM)
    expect(coords).toEqual([0, 0])
})


