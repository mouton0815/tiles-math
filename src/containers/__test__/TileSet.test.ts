import { TileSet } from '../TileSet'
import { Tile } from '../../types/Tile'
import { TileNo } from '../../types/TileNo'
import { Centroid } from '../../types/Centroid'
import { TileRectangle } from '../../types/TileRectangle'

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

const toTileNo = ({ x, y }: Tile): TileNo => ({ x, y }) // Drop z field

test('clone-shallow', () => {
    const tiles = [{ x: 1, y: 3 },  { x: 2, y: 2 }]
    const source = new TileSet(0).addTiles(tiles)
    const cloned = source.clone()
    expect(cloned.map(toTileNo)).toEqual(tiles)
    source.clear() // Should affect wrapped data structures
    expect(cloned.getSize()).toBe(0)
    expect(cloned.boundingBox()).toBe(null)
})

test('clone-deep', () => {
    const tiles = [{ x: 1, y: 3 },  { x: 2, y: 2 }]
    const source = new TileSet(0).addTiles(tiles)
    const cloned = source.clone(true)
    expect(cloned.map(toTileNo)).toEqual(tiles)
    source.clear() // Should NOT affect cloned
    expect(cloned.map(toTileNo)).toEqual(tiles)
})

test('add', () => {
    const tile = { x: 1, y: 3 }
    const tileSet = new TileSet(0)
    expect(tileSet.addTile(tile)).toBe(true)
    expect(tileSet.addTile(tile)).toBe(false)
    expect(tileSet.has(tile)).toBe(true)
    expect(tileSet.getSize()).toBe(1)
})

test('clear', () => {
    const tileSet = new TileSet(0).addTiles([{ x: 1, y: 3 }, { x: 3, y: 2 }])
    expect(tileSet.boundingBox(0)).toEqual(TileRectangle.of(1, 2, 3, 2, 0))
    tileSet.clear()
    expect(tileSet.toArray()).toEqual([])
    expect(tileSet.boundingBox(0)).toBe(null)
})

test('merge', () => {
    const tile1 = { x: 1, y: 2 }
    const tileSet = new TileSet(0).addTiles([tile1])

    const tile2 = { x: 1, y: 3 }
    const tile3 = { x: 2, y: 2 }
    const otherMap = new TileSet(0).addTiles([tile2, tile3])

    tileSet.merge(otherMap)
    expect(tileSet.getSize()).toBe(3)
    expect(tileSet.has(tile1)).toBe(true)
    expect(tileSet.has(tile2)).toBe(true)
    expect(tileSet.has(tile3)).toBe(true)
})

test('mergeDiff', () => {
    const tile1 = { x: 1, y: 2 }
    const tileSet = new TileSet(0).addTiles([tile1])

    const tile2 = { x: 1, y: 3 }
    const tile3 = { x: 2, y: 2 }
    const otherMap = new TileSet(0).addTiles([tile2, tile1, tile3])

    const diffSet = tileSet.mergeDiff(otherMap)
    expect(diffSet.getSize()).toBe(2)
    expect(diffSet.has(tile2)).toBe(true)
    expect(diffSet.has(tile3)).toBe(true)
})

test('has', () => {
    const tile = { x: 1, y: 3 }
    const tileSet = new TileSet(0).addTiles([tile])
    expect(tileSet.has(tile)).toBe(true)
})

test('hasNeighbor', () => {
    const tileSet = new TileSet(0).addTiles([{ x: 1, y: 2 }])
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

test('isDetachedFrom', () => {
    //     1   2   3   4   5
    // 1 | A |   |   | D |   |
    // 2 |   | B |   | D | D |
    // 3 | B | B |   |   |   |
    // 4 |   |   | C | C | C |
    const tileSetA = new TileSet(0).addTiles([{ x: 1, y: 1 }])
    const tileSetB = new TileSet(0).addTiles([{ x: 2, y: 2 }, { x: 2, y: 3 }, { x: 1, y: 3 }])
    const tileSetC = new TileSet(0).addTiles([{ x: 4, y: 4 }, { x: 5, y: 4 }, { x: 3, y: 4 }])
    const tileSetD = new TileSet(0).addTiles([{ x: 4, y: 2 }, { x: 4, y: 1 }, { x: 5, y: 2 }])
    expect(tileSetA.isDetachedFrom(tileSetA, 1)).toBe(false)
    expect(tileSetA.isDetachedFrom(tileSetB, 1)).toBe(false)
    expect(tileSetA.isDetachedFrom(tileSetC)).toBe(true) // Use default margin
    expect(tileSetA.isDetachedFrom(tileSetD)).toBe(true)
    expect(tileSetB.isDetachedFrom(tileSetC, 1)).toBe(false)
    expect(tileSetB.isDetachedFrom(tileSetD, 1)).toBe(true)
    expect(tileSetC.isDetachedFrom(tileSetD, 1)).toBe(true)
    expect(tileSetC.merge(tileSetD).isDetachedFrom(tileSetD, 1)).toBe(false)
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

test('boundingBox', () => {
    //     1   2   3
    // 1 |   | x |   |
    // 2 | x |   | x |
    // 3 |   | x |   |
    // 4 | x |   |   |
    const tileSet = new TileSet(0)
    expect(tileSet.boundingBox()).toBe(null)
    tileSet.addTile({ x: 1, y: 4 })
    expect(tileSet.boundingBox()).toEqual(TileRectangle.of(1, 4, 1, 1, 0))
    expect(tileSet.boundingBox(1)).toEqual(TileRectangle.of(0, 3, 3, 3, 0))
    tileSet.addTile({ x: 1, y: 2 })
    tileSet.addTile({ x: 2, y: 1 })
    tileSet.addTile({ x: 2, y: 3 })
    tileSet.addTile({ x: 3, y: 2 })
    expect(tileSet.boundingBox()).toEqual(TileRectangle.of(1, 1, 3, 4, 0))
    expect(tileSet.boundingBox(2)).toEqual(TileRectangle.of(-1, -1, 7, 8, 0))
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
