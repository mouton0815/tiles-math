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

// Tests a bug in the first version of the delta-clustering algorithm
test('cluster-delta-extend-bottom', () => {
    //     1   2   3
    // 1 |   | A |   |
    // 2 | A | A | A |
    // 3 | A | A | A |
    // 4 |   | B |   |
    const tilesA = [
        [2, 1],
        [1, 2], [2, 2], [3, 2],
        [1, 3], [2, 3], [3, 3],
    ]
    const clustersA = delta2clusters(createSet(tilesA, 0))
    expect(clustersA.maxCluster.map(fromTile)).toEqual([
        [2, 2],
    ])
    expect(clustersA.minorClusters.toArray()).toEqual([])
    expect(clustersA.detachedTiles.map(fromTile)).toEqual([
        [1, 2],
        [1, 3],
        [2, 1],
        [2, 3],
        [3, 2],
        [3, 3]
    ])

    const tilesB = [
        [2, 4],
    ]
    const clustersB = delta2clusters(createSet(tilesB, 0), clustersA)
    expect(clustersB.maxCluster.map(fromTile)).toEqual([
        [2, 2],
        [2, 3],
    ])
    expect(clustersB.minorClusters.toArray()).toEqual([])
    // console.log(clustersB.detachedTiles.map(fromTile))
    expect(clustersB.detachedTiles.map(fromTile)).toEqual([
        [1, 2],
        [1, 3],
        [2, 1],
        [2, 4],
        [3, 2],
        [3, 3],
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
    expect(clustersA.detachedTiles.map(fromTile)).toEqual([
        [1, 2],
        [2, 1],
        [2, 2],
        [2, 3],
        [3, 4],
        [4, 3],
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
    expect(clustersB.maxCluster.map(fromTile)).toEqual([
        [2, 2],
    ])
    expect(clustersB.minorClusters.toArray()).toEqual([])
    expect(clustersB.detachedTiles.map(fromTile)).toEqual([
        [1, 2],
        [2, 1],
        [2, 3],
        [3, 4],
        [3, 2],
        [4, 3],
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
    expect(clustersC.allClusters.length).toBe(2)
    expect(clustersC.maxCluster.map(fromTile)).toEqual([
        [2, 2],
    ])
    expect(clustersC.minorClusters.map(fromTile)).toEqual([
        [3, 3],
    ])
    expect(clustersC.detachedTiles.map(fromTile)).toEqual([
        [1, 2],
        [2, 1],
        [2, 3],
        [3, 4],
        [3, 2],
        [4, 3],
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
    expect(clustersD.allClusters.length).toBe(1)
    expect(clustersD.maxCluster.map(fromTile)).toEqual([
        [2, 2],
        [3, 2],
        [3, 3],
    ])
    expect(clustersD.minorClusters.toArray()).toEqual([])
    expect(clustersD.detachedTiles.map(fromTile)).toEqual([
        [1, 2],
        [2, 1],
        [2, 3],
        [3, 4],
        [3, 1],
        [4, 3],
        [4, 2],
    ])
})

// Tests a bug where minor clusters were unintentionally connected due to in-place merging.
test('cluster-delta-wrongly-connected', () => {
    //     1   2   3   4   5   6   7   8   9   10  11  12  13
    // 1 |   | A | A |   |   |   | A |   |   |   | A | A |   |
    // 2 | A | A | A | A |   | A | A | A |   | A | A | A | A |
    // 3 |   | A | A |   |   |   | A |   |   |   | A | A |   |
    const tilesA = [
        [2, 1], [3, 1], [7, 1], [11, 1], [12, 1],
        [1, 2], [2, 2], [3, 2], [4, 2], [6, 2], [7, 2], [8, 2], [10, 2], [11, 2], [12, 2], [13, 2],
        [2, 3], [3, 3], [7, 3], [11, 3], [12, 3],
    ]
    const clustersA = delta2clusters(createSet(tilesA, 0))
    expect(clustersA.allClusters.length).toBe(3)
    expect(clustersA.maxCluster.map(fromTile)).toEqual([
        [2, 2],
        [3, 2],
    ])
    // console.log(clustersA.minorClusters.map(fromTile))
    expect(clustersA.minorClusters.map(fromTile)).toEqual([
        [7, 2],
        [11, 2],
        [12, 2],
    ])

    // The 2nd iteration does not add tiles.
    // However, since in the previous step, clustersA.allClusters[1] was wrongly merged
    // into clustersA.allClusters[2], the latter cluster became the maximum one.
    const tilesB: number[][] = []
    const clustersB = delta2clusters(createSet(tilesB, 0), clustersA)
    expect(clustersB.allClusters.length).toBe(3)
    expect(clustersB.maxCluster.map(fromTile)).toEqual([
        [2, 2],
        [3, 2],
    ])
    // console.log(clustersA.minorClusters.map(fromTile))
    expect(clustersB.minorClusters.map(fromTile)).toEqual([
        [7, 2],
        [11, 2],
        [12, 2],
    ])
})