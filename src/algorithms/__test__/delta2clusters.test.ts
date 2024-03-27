import { delta2clusters } from '../delta2clusters'
import { Tile } from '../../types/Tile'
import { TileNo } from '../../types/TileNo'
import { TileSet } from '../../containers/TileSet'
import { tiles2clusters } from '../tiles2clusters'

const convert = ([x, y]: number[]): TileNo => ({ x, y })

const createSet = (tiles: number[][], zoom: number): TileSet => {
    return new TileSet(zoom).addTiles(tiles.map(convert))
}


test.only('cluster-delta-left', () => {
//     1   2   3
// 1 |   | A |   |
// 2 | B | A | A |
// 3 |   | A |  |
    const tilesA = [
        [2, 1],
        [2, 2], [3, 2],
        [2, 3]
    ]
    const clustersA = tiles2clusters(createSet(tilesA, 0))
    expect(clustersA.maxCluster.toArray()).toEqual([])
    expect(clustersA.minorClusters.toArray()).toEqual([])
    expect(clustersA.detachedTiles.toArray()).toEqual([
        Tile.of(2, 1, 0),
        Tile.of(2, 2, 0),
        Tile.of(2, 3, 0),
        Tile.of(3, 2, 0),
    ])

    const tilesB = [
        [1, 2],
    ]
    const clustersB = delta2clusters(createSet(tilesB, 0), clustersA)
    expect(clustersB.maxCluster.toArray()).toEqual([
        Tile.of(2, 2, 0),
    ])
    expect(clustersB.minorClusters.toArray()).toEqual([])
    expect(clustersB.detachedTiles.toArray()).toEqual([
        Tile.of(2, 1, 0),
        Tile.of(2, 3, 0),
        Tile.of(3, 2, 0),
        Tile.of(1, 2, 0),
    ])
})

// TODO: Add example where two clusters get connected

//     1   2   3   4
// 1 |   | A | D |   |
// 2 | A | A | B | D |
// 3 |   | A | C | A |
// 4 |   |   | A |   |
test.only('cluster-delta-complex', () => {
    //     1   2   3   4
    // 1 |   | A |   |   |
    // 2 | A | A |   |   |
    // 3 |   | A |   | A |
    // 4 |   |   | A |   |
    const tilesA = [
        [2, 1],
        [1, 2], [2, 2],
        [2, 3], [4, 3],
        [3, 4],
    ]
    const clustersA = tiles2clusters(createSet(tilesA, 0))
    expect(clustersA.maxCluster.toArray()).toEqual([])
    expect(clustersA.minorClusters.toArray()).toEqual([])
    expect(clustersA.detachedTiles.toArray()).toEqual([
        Tile.of(1, 2, 0),
        Tile.of(2, 1, 0),
        Tile.of(2, 2, 0),
        Tile.of(2, 3, 0),
        Tile.of(3, 4, 0),
        Tile.of(4, 3, 0),
    ])

    //     1   2   3   4
    // 1 |   | A |   |   |
    // 2 | A | A | B |   |
    // 3 |   | A |   | A |
    // 4 |   |   | A |   |
    const tilesB = [
        [3, 2],
    ]
    const clustersB = delta2clusters(createSet(tilesB, 0), clustersA)
    expect(clustersB.maxCluster.toArray()).toEqual([
        Tile.of(2, 2, 0),
    ])
    expect(clustersB.minorClusters.toArray()).toEqual([])
    expect(clustersB.detachedTiles.toArray()).toEqual([
        Tile.of(1, 2, 0),
        Tile.of(2, 1, 0),
        Tile.of(2, 3, 0),
        Tile.of(3, 4, 0),
        Tile.of(3, 2, 0), // TODO: Why is this in wrong order?
        Tile.of(4, 3, 0),
    ])

    //     1   2   3   4
    // 1 |   | A |   |   |
    // 2 | A | A | B |   |
    // 3 |   | A | C | A |
    // 4 |   |   | A |   |
    const tilesC = [
        [3, 3],
    ]
    const clustersC = delta2clusters(createSet(tilesC, 0), clustersB)
    expect(clustersC.maxCluster.toArray()).toEqual([
        Tile.of(2, 2, 0),
    ])
    expect(clustersC.minorClusters.toArray()).toEqual([
        Tile.of(3, 3, 0),
    ])
    expect(clustersC.detachedTiles.toArray()).toEqual([
        Tile.of(1, 2, 0),
        Tile.of(2, 1, 0),
        Tile.of(2, 3, 0),
        Tile.of(3, 4, 0),
        Tile.of(3, 2, 0), // TODO: Why is this in wrong order?
        Tile.of(4, 3, 0),
    ])

    //     1   2   3   4
    // 1 |   | A | D |   |
    // 2 | A | A | B | D |
    // 3 |   | A | C | A |
    // 4 |   |   | A |   |
    const tilesD = [
        [4, 2],
        [3, 1],
    ]
    const clustersD = delta2clusters(createSet(tilesD, 0), clustersC)
    expect(clustersD.maxCluster.toArray()).toEqual([
        Tile.of(2, 2, 0),
        Tile.of(3, 2, 0),
        Tile.of(3, 3, 0),
    ])
    expect(clustersD.minorClusters.toArray()).toEqual([])
    expect(clustersD.detachedTiles.toArray()).toEqual([
        Tile.of(1, 2, 0),
        Tile.of(2, 1, 0),
        Tile.of(2, 3, 0),
        Tile.of(3, 4, 0),
        Tile.of(3, 1, 0), // TODO: Why is this in wrong order?
        Tile.of(4, 3, 0),
        Tile.of(4, 2, 0), // TODO: Why is this in wrong order?
    ])
})