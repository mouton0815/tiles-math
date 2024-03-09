import { tiles2clusters } from '../tiles2clusters'
import { TileSet } from '../../containers/TileSet'
import { Tile } from '../../types/Tile'
import { TileNo } from '../../types/TileNo'

const convert = ([x, y]: number[]): TileNo => ({ x, y })

const createSet = (tiles: number[][], zoom: number): TileSet => {
    return new TileSet(zoom).addTiles(tiles.map(convert))
}

test('cluster-empty', () => {
    const tileClusters = tiles2clusters(new TileSet(0))
    expect(tileClusters.maxCluster.toArray()).toEqual([])
    expect(tileClusters.minorClusters.toArray()).toEqual([])
    expect(tileClusters.detachedTiles.toArray()).toEqual([])
})

test('cluster-none', () => {
    //     1   2
    // 1 |   | x |
    // 2 | x |   |
    const tiles = [
        [1, 2],
        [2, 1]
    ]
    const tileClusters = tiles2clusters(createSet(tiles, 0))
    expect(tileClusters.maxCluster.toArray()).toEqual([])
    expect(tileClusters.minorClusters.toArray()).toEqual([])
    expect(tileClusters.detachedTiles.toArray()).toEqual([
        Tile.of(1, 2, 0),
        Tile.of(2, 1, 0),
    ])
})

test('cluster-simple', () => {
    //     1   2   3
    // 1 |   | x |   |
    // 2 | x | x | x |
    // 3 |   | x |   |
    const tiles = [
        [2, 1],
        [1, 2], [2, 2], [3, 2],
        [2, 3],
    ]
    const tileClusters = tiles2clusters(createSet(tiles, 0))
    expect(tileClusters.maxCluster.toArray()).toEqual([
        Tile.of(2, 2, 0)
    ])
    expect(tileClusters.detachedTiles.toArray()).toEqual([
        Tile.of(1, 2, 0),
        Tile.of(2, 1, 0),
        Tile.of(2, 3, 0),
        Tile.of(3, 2, 0),
    ])
})

test('cluster-separated', () => {
    //     1   2   3   4
    // 1 |   | x |   |   |
    // 2 | x | x | x |   |
    // 3 |   | x | x | x |
    // 4 |   |   | x |   |
    const tiles = [
        [2, 1],
        [1, 2], [2, 2], [3, 2],
        [2, 3], [3, 3], [4, 3],
        [3, 4],
    ]
    const tileClusters = tiles2clusters(createSet(tiles, 0))
    expect(tileClusters.maxCluster.toArray()).toEqual([
        Tile.of(2, 2, 0),
    ])
    expect(tileClusters.minorClusters.toArray()).toEqual([
        Tile.of(3, 3, 0),
    ])
    expect(tileClusters.detachedTiles.toArray()).toEqual([
        Tile.of(1, 2, 0),
        Tile.of(2, 1, 0),
        Tile.of(2, 3, 0),
        Tile.of(3, 2, 0),
        Tile.of(3, 4, 0),
        Tile.of(4, 3, 0),
    ])
})

test('cluster-large', () => {
    //     1   2   3   4
    // 1 |   | x | x |   |
    // 2 | x | x | x | x |
    // 3 |   | x | x |   |
    const tiles = [
        [2, 1], [3, 1],
        [1, 2], [2, 2], [3, 2], [4, 2],
        [2, 3], [3, 3]
    ]
    const tileClusters = tiles2clusters(createSet(tiles, 0))
    expect(tileClusters.maxCluster.toArray()).toEqual([
        Tile.of(2, 2, 0),
        Tile.of(3, 2, 0),
    ])
    expect(tileClusters.minorClusters.toArray()).toEqual([])
    expect(tileClusters.detachedTiles.toArray()).toEqual([
        Tile.of(1, 2, 0),
        Tile.of(2, 1, 0),
        Tile.of(2, 3, 0),
        Tile.of(3, 1, 0),
        Tile.of(3, 3, 0),
        Tile.of(4, 2, 0),
    ])
})

test('cluster-large-and-separated', () => {
    //     1   2   3   4   5   6
    // 1 |   | x |   |   | x |   |
    // 2 | x | x | x | x | x | x |
    // 3 |   | x |   |   | x |   |
    // 4 |   | x | x |   |   |   |
    // 5 | x | x | x | x |   |   |
    // 6 |   | x | x |   |   |   |
    const tiles = [
        [2, 1], [5, 1],
        [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
        [2, 3], [5, 3],
        [2, 4], [3, 4],
        [1, 5], [2, 5], [3, 5], [4, 5],
        [2, 6], [3, 6],
    ]
    const tileClusters = tiles2clusters(createSet(tiles, 0))
    expect(tileClusters.maxCluster.toArray()).toEqual([
        Tile.of(2, 5, 0),
        Tile.of(3, 5, 0),
    ])
    expect(tileClusters.minorClusters.toArray()).toEqual([
        Tile.of(2, 2, 0),
        Tile.of(5, 2, 0),
    ])
    expect(tileClusters.detachedTiles.toArray()).toEqual([
        Tile.of(1, 2, 0),
        Tile.of(1, 5, 0),
        Tile.of(2, 1, 0),
        Tile.of(2, 3, 0),
        Tile.of(2, 4, 0),
        Tile.of(2, 6, 0),
        Tile.of(3, 2, 0),
        Tile.of(3, 4, 0),
        Tile.of(3, 6, 0),
        Tile.of(4, 2, 0),
        Tile.of(4, 5, 0),
        Tile.of(5, 1, 0),
        Tile.of(5, 3, 0),
        Tile.of(6, 2, 0),
    ])
})
