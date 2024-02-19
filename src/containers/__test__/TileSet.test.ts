import { TileSet } from '../TileSet'
import { Tile } from '../../types/Tile'

/*
function compareTiles(a: Point, b: Point): number {
    if (a.x < b.x || a.x === b.x && a.y < b.y) {
        return -1;
   ) else if (a.x > b.x || a.x === b.x && a.y > b.y) {
        return 1;
    }
    return 0;
}
*/

test('ctor', () => {
    const tile1 = Tile.of(1, 3)
    const tile2 = Tile.of(2, 3)
    const tileSet = new TileSet(new TileSet().add(tile1)).add(tile2)
    expect(tileSet.size).toBe(2)
    expect(tileSet.has(tile1)).toBe(true)
    expect(tileSet.has(tile2)).toBe(true)
})

test('has', () => {
    const tile = Tile.of(1, 3)
    const tileSet = new TileSet().add(tile)
    expect(tileSet.has(tile)).toBe(true)
})

test('add', () => {
    const tile = Tile.of(1, 3)
    const tileSet = new TileSet().add(tile).add(tile)
    expect(tileSet.has(tile)).toBe(true)
    expect(tileSet.size).toBe(1)
})

test('merge', () => {
    const tile1 = Tile.of(1, 2)
    const tileSet = new TileSet().add(tile1)

    const tile2 = Tile.of(1, 3)
    const tile3 = Tile.of(2, 2)
    const otherMap = new TileSet().add(tile2).add(tile3)

    tileSet.merge(otherMap)
    expect(tileSet.size).toBe(3)
    expect(tileSet.has(tile1)).toBe(true)
    expect(tileSet.has(tile2)).toBe(true)
    expect(tileSet.has(tile3)).toBe(true)
})

test('hasNeighbor', () => {
    const tileSet = new TileSet().add(Tile.of(1, 2))
    expect(tileSet.hasNeighbor(Tile.of(1, 2))).toBe(false)
    expect(tileSet.hasNeighbor(Tile.of(1, 1))).toBe(true)
    expect(tileSet.hasNeighbor(Tile.of(1, 3))).toBe(true)
    expect(tileSet.hasNeighbor(Tile.of(0, 2))).toBe(true)
    expect(tileSet.hasNeighbor(Tile.of(2, 2))).toBe(true)
    expect(tileSet.hasNeighbor(Tile.of(0, 1))).toBe(false)
})

test('hasNeighbors', () => {
    const tileSet = new TileSet()
    const tile = Tile.of(1, 1)
    expect(tileSet.hasNeighbors(tile)).toBe(false)
    tileSet.add(Tile.of(0, 1))
    expect(tileSet.hasNeighbors(tile)).toBe(false)
    tileSet.add(Tile.of(2, 1))
    expect(tileSet.hasNeighbors(tile)).toBe(false)
    tileSet.add(Tile.of(1, 0))
    expect(tileSet.hasNeighbors(tile)).toBe(false)
    tileSet.add(Tile.of(1, 2))
    expect(tileSet.hasNeighbors(tile)).toBe(true) // Finally...
})

test('centroid', () => {
    //     1   2   3   4   5   6
    // 1 |   | x |   |   | x | x |
    // 2 |   | x |   | x | x |   |
    // 3 | x | x | x | x | x |   |
    // 4 |   | x | x | x | x |   |
    const tileSet = new TileSet()
    expect(tileSet.centroid()).toBe(null)
    tileSet.add(Tile.of(1, 3))
    expect(tileSet.centroid()).toEqual({ x: 1.5, y: 3.5 })
    tileSet.add(Tile.of(2, 1))
    expect(tileSet.centroid()).toEqual({ x: 2, y: 2.5 })
    tileSet.add(Tile.of(2, 2))
    expect(tileSet.centroid()).toEqual({ x: 2.17, y: 2.5 })
    tileSet.add(Tile.of(2, 3))
    expect(tileSet.centroid()).toEqual({ x: 2.25, y: 2.75 })
    tileSet.add(Tile.of(3, 3))
    expect(tileSet.centroid()).toEqual({ x: 2.5, y: 2.9 })
    tileSet.add(Tile.of(2, 4))
    expect(tileSet.centroid()).toEqual({ x: 2.5, y: 3.17 })
    tileSet.add(Tile.of(3, 3))
    expect(tileSet.centroid()).toEqual({ x: 2.5, y: 3.17 })
    tileSet.add(Tile.of(3, 4))
    expect(tileSet.centroid()).toEqual({ x: 2.64, y: 3.36 })
    tileSet.add(Tile.of(4, 2))
    expect(tileSet.centroid()).toEqual({ x: 2.88, y: 3.25 })
    tileSet.add(Tile.of(4, 3))
    expect(tileSet.centroid()).toEqual({ x: 3.06, y: 3.28 })
    tileSet.add(Tile.of(4, 4))
    expect(tileSet.centroid()).toEqual({ x: 3.2, y: 3.4 })
    tileSet.add(Tile.of(5, 1))
    expect(tileSet.centroid()).toEqual({ x: 3.41, y: 3.23 })
    tileSet.add(Tile.of(5, 2))
    expect(tileSet.centroid()).toEqual({ x: 3.58, y: 3.17 })
    tileSet.add(Tile.of(5, 3))
    expect(tileSet.centroid()).toEqual({ x: 3.73, y: 3.19 })
    tileSet.add(Tile.of(5, 4))
    expect(tileSet.centroid()).toEqual({ x: 3.86, y: 3.29 })
    tileSet.add(Tile.of(6, 1))
    expect(tileSet.centroid()).toEqual({ x: 4.03, y: 3.17 })
})

test('map', () => {
    const tiles : Array<Tile> = [Tile.of(2, 2), Tile.of(1, 2), Tile.of(1, 1)]
    const tileSet = new TileSet().addAll(tiles)
    const results = tileSet.map(tile => tile.x + tile.y)
    expect(results).toEqual([4, 3, 2])
})

test('map-with-index', () => {
    const tiles : Array<Tile> = [Tile.of(2, 2), Tile.of(1, 2), Tile.of(1, 1)]
    const tileSet = new TileSet().addAll(tiles)
    const results = tileSet.map((tile, index) => 2 * index + (tile.x + tile.y))
    expect(results).toEqual([4, 5, 6])
})

test('toArray', () => {
    const tiles : Array<Tile> = [Tile.of(1, 2), Tile.of(2, 1), Tile.of(1, 1)]
    const tileSet = new TileSet().addAll(tiles)
    const expected : Array<Tile> = [Tile.of(1, 2), Tile.of(1, 1), Tile.of(2, 1)]
    expect(tileSet.toArray()).toEqual(expected)
})

test('getSorted', () => {
    const tileSet = new TileSet().addAll([Tile.of(2, 2), Tile.of(3, 3), Tile.of(1, 1), Tile.of(2, 1)])
    expect(tileSet.getSortedXs()).toEqual([1, 2, 3])
    expect(tileSet.getSortedYs(2)).toEqual([1, 2])
    expect(tileSet.getSortedYs(0)).toEqual([])
})

test('iterator', () => {
    const tiles : Array<Tile> = [Tile.of(2, 1), Tile.of(1, 2), Tile.of(1, 1)]
    const tileSet = new TileSet().addAll(tiles)
    const results = new Array<Tile>()
    for (const tile of tileSet) { // Iterator keeps insertion order
        results.push(tile)
    }
    expect(results).toEqual(tiles)
})
