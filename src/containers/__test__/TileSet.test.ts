import { TileSet } from '../TileSet'
import { Tile } from '../../types/Tile'
import { TileNo } from '../../types/TileNo'
import { Centroid } from '../../types/Centroid'

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

test('clone', () => {
    const tile1 = { x: 1, y: 3 }
    const tile2 = { x: 2, y: 3 }
    const tileSet = new TileSet(0).addTiles([tile1, tile2]).clone()
    expect(tileSet.getSize()).toBe(2)
    expect(tileSet.has(tile1)).toBe(true)
    expect(tileSet.has(tile2)).toBe(true)
})

test('has', () => {
    const tile = { x: 1, y: 3 }
    const tileSet = new TileSet(0).addTile(tile)
    expect(tileSet.has(tile)).toBe(true)
})

test('add', () => {
    const tile = { x: 1, y: 3 }
    const tileSet = new TileSet(0).addTile(tile).addTile(tile)
    expect(tileSet.has(tile)).toBe(true)
    expect(tileSet.getSize()).toBe(1)
})

test('merge', () => {
    const tile1 = { x: 1, y: 2 }
    const tileSet = new TileSet(0).addTile(tile1)

    const tile2 = { x: 1, y: 3 }
    const tile3 = { x: 2, y: 2 }
    const otherMap = new TileSet(0).addTile(tile2).addTile(tile3)

    tileSet.merge(otherMap)
    expect(tileSet.getSize()).toBe(3)
    expect(tileSet.has(tile1)).toBe(true)
    expect(tileSet.has(tile2)).toBe(true)
    expect(tileSet.has(tile3)).toBe(true)
})

test('hasNeighbor', () => {
    const tileSet = new TileSet(0).addTile({ x: 1, y: 2 })
    expect(tileSet.hasNeighbor({ x: 1, y: 2 })).toBe(false)
    expect(tileSet.hasNeighbor({ x: 1, y: 1 })).toBe(true)
    expect(tileSet.hasNeighbor({ x: 1, y: 3 })).toBe(true)
    expect(tileSet.hasNeighbor({ x: 0, y: 2 })).toBe(true)
    expect(tileSet.hasNeighbor({ x: 2, y: 2 })).toBe(true)
    expect(tileSet.hasNeighbor({ x: 0, y: 1 })).toBe(false)
})

test('hasNeighbors', () => {
    const tileSet = new TileSet(0)
    const tile = { x: 1, y: 1 }
    expect(tileSet.hasNeighbors(tile)).toBe(false)
    tileSet.addTile({ x: 0, y: 1 })
    expect(tileSet.hasNeighbors(tile)).toBe(false)
    tileSet.addTile({ x: 2, y: 1 })
    expect(tileSet.hasNeighbors(tile)).toBe(false)
    tileSet.addTile({ x: 1, y: 0 })
    expect(tileSet.hasNeighbors(tile)).toBe(false)
    tileSet.addTile({ x: 1, y: 2 })
    expect(tileSet.hasNeighbors(tile)).toBe(true) // Finally...
})

test('centroid', () => {
    //     1   2   3   4   5   6
    // 1 |   | x |   |   | x | x |
    // 2 |   | x |   | x | x |   |
    // 3 | x | x | x | x | x |   |
    // 4 |   | x | x | x | x |   |
    const tileSet = new TileSet(7)
    expect(tileSet.centroid()).toBe(null)
    tileSet.addTile({ x: 1, y: 3 })
    expect(tileSet.centroid()).toEqual(Centroid.of(1.5, 3.5, 7))
    tileSet.addTile({ x: 2, y: 1 })
    expect(tileSet.centroid()).toEqual(Centroid.of(2, 2.5, 7))
    tileSet.addTile({ x: 2, y: 2 })
    expect(tileSet.centroid()).toEqual(Centroid.of(2.17, 2.5, 7))
    tileSet.addTile({ x: 2, y: 3 })
    expect(tileSet.centroid()).toEqual(Centroid.of(2.25, 2.75, 7))
    tileSet.addTile({ x: 3, y: 3 })
    expect(tileSet.centroid()).toEqual(Centroid.of(2.5, 2.9, 7))
    tileSet.addTile({ x: 2, y: 4 })
    expect(tileSet.centroid()).toEqual(Centroid.of(2.5, 3.17, 7))
    tileSet.addTile({ x: 3, y: 3 })
    expect(tileSet.centroid()).toEqual(Centroid.of(2.5, 3.17, 7))
    tileSet.addTile({ x: 3, y: 4 })
    expect(tileSet.centroid()).toEqual(Centroid.of(2.64, 3.36, 7))
    tileSet.addTile({ x: 4, y: 2 })
    expect(tileSet.centroid()).toEqual(Centroid.of(2.88, 3.25, 7))
    tileSet.addTile({ x: 4, y: 3 })
    expect(tileSet.centroid()).toEqual(Centroid.of(3.06, 3.28, 7))
    tileSet.addTile({ x: 4, y: 4 })
    expect(tileSet.centroid()).toEqual(Centroid.of(3.2, 3.4, 7))
    tileSet.addTile({ x: 5, y: 1 })
    expect(tileSet.centroid()).toEqual(Centroid.of(3.41, 3.23, 7))
    tileSet.addTile({ x: 5, y: 2 })
    expect(tileSet.centroid()).toEqual(Centroid.of(3.58, 3.17, 7))
    tileSet.addTile({ x: 5, y: 3 })
    expect(tileSet.centroid()).toEqual(Centroid.of(3.73, 3.19, 7))
    tileSet.addTile({ x: 5, y: 4 })
    expect(tileSet.centroid()).toEqual(Centroid.of(3.86, 3.29, 7))
    tileSet.addTile({ x: 6, y: 1 })
    expect(tileSet.centroid()).toEqual(Centroid.of(4.03, 3.17, 7))
})

test('map', () => {
    const tiles : Array<TileNo> = [{ x: 2, y: 2 }, { x: 1, y: 2 }, { x: 1, y: 1 }]
    const tileSet = new TileSet(0).addTiles(tiles)
    const results = tileSet.map(tile => tile.x + tile.y)
    expect(results).toEqual([4, 3, 2])
})

test('map-with-index', () => {
    const tiles : Array<TileNo> = [{ x: 2, y: 2 }, { x: 1, y: 2 }, { x: 1, y: 1 }]
    const tileSet = new TileSet(0).addTiles(tiles)
    const results = tileSet.map((tile, index) => 2 * index + (tile.x + tile.y))
    expect(results).toEqual([4, 5, 6])
})

test('toArray', () => {
    const tiles : Array<TileNo> = [{ x: 1, y: 2 }, { x: 2, y: 1 }, { x: 1, y: 1 }]
    const tileSet = new TileSet(0).addTiles(tiles)
    const expected : Array<Tile> = [Tile.of(1, 2, 0), Tile.of(1, 1, 0), Tile.of(2, 1, 0)]
    expect(tileSet.toArray()).toEqual(expected)
})

test('getSorted', () => {
    const tileSet = new TileSet(0).addTiles([{ x: 2, y: 2 }, { x: 3, y: 3 }, { x: 1, y: 1 }, { x: 2, y: 1 }])
    expect(tileSet.getSortedXs()).toEqual([1, 2, 3])
    expect(tileSet.getSortedYs(2)).toEqual([1, 2])
    expect(tileSet.getSortedYs(0)).toEqual([])
})

test('iterator', () => {
    const tiles : Array<Tile> = [Tile.of(1, 2, 0), Tile.of(1, 1, 0), Tile.of(2, 1, 0)]
    const tileSet = new TileSet(0).addTiles(tiles)
    const results = new Array<Tile>()
    for (const tile of tileSet) { // Iterator keeps insertion order
        results.push(tile)
    }
    expect(results).toEqual(tiles)
})
