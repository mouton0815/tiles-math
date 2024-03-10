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

test('cluster-bugfix-early-vertical-drop', () => {
    // Regression test for a bug that appeared when clusters on the y axis were dropped too early
    //     1   2   3   4
    // 1 |   | x | x |   |
    // 2 | x | x | x | x |
    // 3 |   | x | x | x |
    // 4 | x | x | x | x |
    // 5 |   | x | x |   |
    const tiles = [
        [2, 1], [3, 1],
        [1, 2], [2, 2], [3, 2], [4, 2],
        [2, 3], [3, 3], [4, 3],
        [1, 4], [2, 4], [3, 4], [4, 4],
        [2, 5], [3, 5],
    ]
    const tileClusters = tiles2clusters(createSet(tiles, 0))
    expect(tileClusters.maxCluster.toArray()).toEqual([
        Tile.of(2, 2, 0),
        Tile.of(2, 4, 0),
        Tile.of(3, 2, 0),
        Tile.of(3, 3, 0),
        Tile.of(3, 4, 0),
    ])
    expect(tileClusters.minorClusters.toArray()).toEqual([])
    expect(tileClusters.detachedTiles.toArray()).toEqual([
        Tile.of(1, 2, 0),
        Tile.of(1, 4, 0),
        Tile.of(2, 1, 0),
        Tile.of(2, 3, 0),
        Tile.of(2, 5, 0),
        Tile.of(3, 1, 0),
        Tile.of(3, 5, 0),
        Tile.of(4, 2, 0),
        Tile.of(4, 3, 0),
        Tile.of(4, 4, 0),
    ])
})

test('cluster-nested', () => {
    //     1   2   3   4   5   6   7   8   9
    // 1 |   |   | x | x | x | x | x |   |   |
    // 2 |   | x | x | x | x | x | x | x |   |
    // 3 | x | x | x | x | x | x | x | x | x |
    // 4 | x | x | x |   | x |   | x | x | x |
    // 5 | x | x | x | x | x | x | x | x | x |
    // 6 | x | x | x |   | x |   | x | x | x |
    // 7 | x | x | x | x | x | x | x | x | x |
    // 8 |   | x | x | x | x | x | x | x |   |
    // 9 |   |   | x | x | x | x | x |  |   |
    const tiles = [
        [3, 1], [4, 1], [5, 1], [6, 1], [7, 1],
        [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2],
        [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3], [9, 3],
        [1, 4], [2, 4], [3, 4], [5, 4], [7, 4], [8, 4], [9, 4],
        [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5],
        [1, 6], [2, 6], [3, 6], [5, 6], [7, 6], [8, 6], [9, 6],
        [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7], [9, 7],
        [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8],
        [3, 9], [4, 9], [5, 9], [6, 9], [7, 9],
    ]
    const tileClusters = tiles2clusters(createSet(tiles, 0))
    expect(tileClusters.maxCluster.toArray()).toEqual([
        Tile.of(2, 3, 0),
        Tile.of(2, 4, 0),
        Tile.of(2, 5, 0),
        Tile.of(2, 6, 0),
        Tile.of(2, 7, 0),
        Tile.of(3, 3, 0),
        Tile.of(3, 2, 0),
        Tile.of(3, 5, 0),
        Tile.of(3, 7, 0),
        Tile.of(3, 8, 0),
        Tile.of(4, 2, 0),
        Tile.of(4, 8, 0),
        Tile.of(5, 2, 0),
        Tile.of(5, 3, 0),
        Tile.of(5, 8, 0),
        Tile.of(5, 7, 0),
        Tile.of(6, 2, 0),
        Tile.of(6, 8, 0),
        Tile.of(7, 2, 0),
        Tile.of(7, 3, 0),
        Tile.of(7, 8, 0),
        Tile.of(7, 7, 0),
        Tile.of(7, 5, 0),
        Tile.of(8, 3, 0),
        Tile.of(8, 4, 0),
        Tile.of(8, 5, 0),
        Tile.of(8, 6, 0),
        Tile.of(8, 7, 0),
    ])
    expect(tileClusters.minorClusters.toArray()).toEqual([
        Tile.of(5, 5, 0),
    ])
    expect(tileClusters.detachedTiles.toArray().length).toBe(36) // Just count ...
})
