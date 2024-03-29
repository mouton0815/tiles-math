//
// Tests for incremental cluster creation
//
import { delta2clusters } from '../delta2clusters'
import { Tile } from '../../types/Tile'
import { TileNo } from '../../types/TileNo'
import { TileSet } from '../../containers/TileSet'

const toTileNo = ([x, y]: number[]): TileNo => ({ x, y })

const fromTile = ({ x, y }: Tile): number[] => ([x, y])

const createSet = (tiles: number[][], zoom: number): TileSet => {
    return new TileSet(zoom).addTiles(tiles.map(toTileNo))
}

test('cluster-delta-top', () => {
    //     1   2   3
    // 1 |   | B |   |
    // 2 | A | A | A |
    // 3 |   | A |   |
    const tilesA = [
        [1, 2], [2, 2], [3, 2],
        [2, 3]
    ]
    const clustersA = delta2clusters(createSet(tilesA, 0))
    expect(clustersA.maxCluster.toArray()).toEqual([])
    expect(clustersA.minorClusters.toArray()).toEqual([])
    // console.log(clustersA.detachedTiles.map(fromTile))
    expect(clustersA.detachedTiles.map(fromTile)).toEqual([
        [1, 2],
        [2, 2],
        [2, 3],
        [3, 2],
    ])

    const tilesB = [
        [2, 1],
    ]
    const clustersB = delta2clusters(createSet(tilesB, 0), clustersA)
    expect(clustersB.maxCluster.map(fromTile)).toEqual([
        [2, 2],
    ])
    expect(clustersB.minorClusters.toArray()).toEqual([])
    expect(clustersB.detachedTiles.map(fromTile)).toEqual([
        [1, 2],
        [2, 3],
        [2, 1],
        [3, 2],
    ])
})

test('cluster-delta-left', () => {
    //     1   2   3
    // 1 |   | A |   |
    // 2 | B | A | A |
    // 3 |   | A |   |
    const tilesA = [
        [2, 1],
        [2, 2], [3, 2],
        [2, 3]
    ]
    const clustersA = delta2clusters(createSet(tilesA, 0))
    expect(clustersA.maxCluster.toArray()).toEqual([])
    expect(clustersA.minorClusters.toArray()).toEqual([])
    expect(clustersA.detachedTiles.map(fromTile)).toEqual([
        [2, 1],
        [2, 2],
        [2, 3],
        [3, 2]
    ])

    const tilesB = [
        [1, 2],
    ]
    const clustersB = delta2clusters(createSet(tilesB, 0), clustersA)
    expect(clustersB.maxCluster.map(fromTile)).toEqual([
        [2, 2],
    ])
    expect(clustersB.minorClusters.toArray()).toEqual([])
    expect(clustersB.detachedTiles.map(fromTile)).toEqual([
        [2, 1],
        [2, 3],
        [3, 2],
        [1, 2],
    ])
})

test('cluster-delta-right', () => {
    //     1   2   3
    // 1 |   | A |   |
    // 2 | A | A | B |
    // 3 |   | A |   |
    const tilesA = [
        [2, 1],
        [1, 2], [2, 2],
        [2, 3]
    ]
    const clustersA = delta2clusters(createSet(tilesA, 0))
    expect(clustersA.maxCluster.toArray()).toEqual([])
    expect(clustersA.minorClusters.toArray()).toEqual([])
    expect(clustersA.detachedTiles.map(fromTile)).toEqual([
        [1, 2],
        [2, 1],
        [2, 2],
        [2, 3]
    ])

    const tilesB = [
        [3, 2],
    ]
    const clustersB = delta2clusters(createSet(tilesB, 0), clustersA)
    expect(clustersB.maxCluster.map(fromTile)).toEqual([
        [2, 2],
    ])
    expect(clustersB.minorClusters.toArray()).toEqual([])
    // console.log(clustersB.detachedTiles.map(fromTile))
    expect(clustersB.detachedTiles.map(fromTile)).toEqual([
        [1, 2],
        [2, 1],
        [2, 3],
        [3, 2],
    ])
})

test('cluster-delta-bottom', () => {
    //     1   2   3
    // 1 |   | A |   |
    // 2 | A | A | A |
    // 3 |   | B |   |
    const tilesA = [
        [2, 1],
        [1, 2], [2, 2], [3, 2],
    ]
    const clustersA = delta2clusters(createSet(tilesA, 0))
    expect(clustersA.maxCluster.toArray()).toEqual([])
    expect(clustersA.minorClusters.toArray()).toEqual([])
    expect(clustersA.detachedTiles.map(fromTile)).toEqual([
        [1, 2],
        [2, 1],
        [2, 2],
        [3, 2]
    ])

    const tilesB = [
        [2, 3],
    ]
    const clustersB = delta2clusters(createSet(tilesB, 0), clustersA)
    expect(clustersB.maxCluster.map(fromTile)).toEqual([
        [2, 2],
    ])
    expect(clustersB.minorClusters.toArray()).toEqual([])
    // console.log(clustersB.detachedTiles.map(fromTile))
    expect(clustersB.detachedTiles.map(fromTile)).toEqual([
        [1, 2],
        [2, 1],
        [2, 3],
        [3, 2],
    ])
})

test('cluster-delta-connect', () => {
    //     1   2   3   4   5
    // 1 |   | A | C | A |   |
    // 2 | A | A | B | A | A |
    // 3 |   | A | C | A |   |
    const tilesA = [
        [2, 1], [4, 1],
        [1, 2], [2, 2], [4, 2], [5, 2],
        [2, 3], [4, 3],
    ]
    const clustersA = delta2clusters(createSet(tilesA, 0))
    expect(clustersA.maxCluster.toArray()).toEqual([])
    expect(clustersA.minorClusters.toArray()).toEqual([])
    expect(clustersA.detachedTiles.map(fromTile)).toEqual([
        [1, 2],
        [2, 1],
        [2, 2],
        [2, 3],
        [4, 1],
        [4, 2],
        [4, 3],
        [5, 2],
    ])

    const tilesB = [
        [3, 2],
    ]
    const clustersB = delta2clusters(createSet(tilesB, 0), clustersA)
    expect(clustersB.maxCluster.map(fromTile)).toEqual([
        [2, 2],
    ])
    expect(clustersB.minorClusters.map(fromTile)).toEqual([
        [4, 2],
    ])
    expect(clustersB.detachedTiles.map(fromTile)).toEqual([
        [1, 2],
        [2, 1],
        [2, 3],
        [4, 1],
        [4, 3],
        [5, 2],
        [3, 2],
    ])

    const tilesC = [
        [3, 3],
        [3, 1],
    ]
    const clustersC = delta2clusters(createSet(tilesC, 0), clustersB)
    expect(clustersC.maxCluster.map(fromTile)).toEqual([
        [2, 2],
        [3, 2],
        [4, 2],
    ])
    expect(clustersC.minorClusters.toArray()).toEqual([])
    expect(clustersC.detachedTiles.map(fromTile)).toEqual([
        [1, 2],
        [2, 1],
        [2, 3],
        [4, 1],
        [4, 3],
        [5, 2],
        [3, 1],
        [3, 3],
    ])
})

//     1   2   3   4
// 1 |   | A | D |   |
// 2 | A | A | B | D |
// 3 |   | A | C | A |
// 4 |   |   | A |   |
test('cluster-delta-complex', () => {
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
    const clustersA = delta2clusters(createSet(tilesA, 0))
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