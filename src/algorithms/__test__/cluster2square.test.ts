import { cluster2square } from '../cluster2square'
import { TileRectangle } from '../../types/TileRectangle'
import { TileSet } from '../../containers/TileSet'
import { TileNo } from '../../types/TileNo'

const convert = ([x, y]: number[]): TileNo => ({ x, y })

const createSet = (tiles: number[][], zoom: number): TileSet => {
    return new TileSet(zoom).addTiles(tiles.map(convert))
}

test('empty', () => {
    const squares = cluster2square(new TileSet(0))
    expect(squares.getSquareSize()).toBe(0)
    expect(squares.getRectangles()).toEqual([])
})

test('simple-one', () => {
    const squares = cluster2square(createSet([[1, 1]], 5))
    expect(squares.getSquareSize()).toBe(1)
    expect(squares.getRectangles()).toEqual([
        TileRectangle.of(1, 1, 1, 1, 5)
    ])
})

test('simple-two', () => {
    //     1   2
    // 1 | x | x |
    // 2 | x | x |
    const tiles = [
        [1, 1], [1, 2],
        [2, 1], [2, 2],
    ]
    const squares = cluster2square(createSet(tiles, 5))
    expect(squares.getSquareSize()).toBe(2)
    expect(squares.getRectangles()).toEqual([
        TileRectangle.of(1, 1, 2, 2, 5)
    ])
})

test('overlapping-rectangles of size one', () => {
    //     1   2   3   4   5
    // 1 | x |   |   |   | x |
    // 2 | x |   | x |   | x |
    // 3 | x | x | x | x | x |
    // 4 | x |   | x |   | x |
    // 5 |   |   |   |   | x |
    const tiles = [
        [1, 1], [1, 2], [1, 3], [1, 4],
        [2, 3],
        [3, 2], [3, 3], [3, 4],
        [4, 3],
        [5, 1], [5, 2], [5, 3], [5, 4], [5, 5],
    ]
    const squares = cluster2square(createSet(tiles, 7))
    expect(squares.getSquareSize()).toBe(1)
    expect(squares.getRectangles()).toEqual([
        TileRectangle.of(1, 1, 1, 4, 7),
        TileRectangle.of(1, 3, 5, 1, 7),
        TileRectangle.of(3, 2, 1, 3, 7),
        TileRectangle.of(5, 1, 1, 5, 7),
    ])
})

test('growing-range', () => {
    //     1   2   3   4   5
    // 1 |   |   |   |   | x |
    // 2 |   |   |   | x | x |
    // 3 |   |   | x | x | x |
    // 4 |   | x | x | x | x |
    // 5 | x | x | x | x | x |
    const tiles = [
        [1, 5],
        [2, 4], [2, 5],
        [3, 3], [3, 4], [3, 5],
        [4, 2], [4, 3], [4, 4], [4, 5],
        [5, 1], [5, 2], [5, 3], [5, 4], [5, 5],
    ]
    const squares = cluster2square(createSet(tiles, 0))
    expect(squares.getSquareSize()).toBe(3)
    expect(squares.getRectangles()).toEqual([
        TileRectangle.of(3, 3, 3, 3, 0)
    ])
})

test('shrinking-range', () => {
    //     1   2   3   4   5
    // 1 | x |   |   |   |   |
    // 2 | x | x |   |   |   |
    // 3 | x | x | x |   |   |
    // 4 | x | x | x | x |   |
    // 5 | x | x | x | x | x |
    const tiles = [
        [1, 1], [1, 2], [1, 3], [1, 4], [1, 5],
        [2, 2], [2, 3], [2, 4], [2, 5],
        [3, 3], [3, 4], [3, 5],
        [4, 4], [4, 5],
        [5, 5],
    ]
    const squares = cluster2square(createSet(tiles, 0))
    expect(squares.getSquareSize()).toBe(3)
    expect(squares.getRectangles()).toEqual([
        TileRectangle.of(1, 3, 3, 3, 0)
    ])
})

test('single-3x3-square', () => {
    //     1   2   3   4   5
    // 1 | x |   |   |   | x |
    // 2 |   |   | x | x | x |
    // 3 | x | x | x | x | x |
    // 4 | x | x | x | x |   |
    // 5 |   | x | x | x |   |
    // 6 | x |   |   | x |   |
    const tiles = [
        [1, 1], [1, 3], [1, 4], [1, 6],
        [2, 3], [2, 4], [2, 5],
        [3, 2], [3, 3], [3, 4], [3, 5],
        [4, 2], [4, 3], [4, 4], [4, 5], [4, 6],
        [5, 1], [5, 2], [5, 3],
        [7, 1],
    ]
    const squares = cluster2square(createSet(tiles, 0))
    expect(squares.getSquareSize()).toBe(3)
    expect(squares.getRectangles()).toEqual([
        TileRectangle.of(2, 3, 3, 3, 0)
    ])
})

test('two-overlapping-2x2-squares-v1', () => {
    //     1   2   3
    // 1 | x | x |   |
    // 2 | x |   | x |
    // 3 | x | x |   |
    // 4 | x | x | x |
    // 5 |   | x | x |
    const tiles = [
        [1, 1], [1, 2], [1, 3], [1, 4],
        [2, 1], [2, 3], [2, 4], [2, 5],
        [3, 2], [3, 4], [3, 5],
    ]
    const squares = cluster2square(createSet(tiles, 5))
    expect(squares.getSquareSize()).toBe(2)
    expect(squares.getRectangles()).toEqual([
        TileRectangle.of(1, 3, 2, 2, 5),
        TileRectangle.of(2, 4, 2, 2, 5)
    ])
})

test('two-overlapping-2x2-squares-v2', () => {
    //     1   2   3   4
    // 1 | x | x |   |   |
    // 2 |   | x | x |   |
    // 3 | x | x | x | x |
    // 4 | x | x |   |   |
    const tiles = [
        [1, 1], [1, 3], [1, 4],
        [2, 1], [2, 2], [2, 3], [2, 4],
        [3, 2], [3, 3],
        [4, 3],
    ]
    const squares = cluster2square(createSet(tiles, 0))
    expect(squares.getSquareSize()).toBe(2)
    expect(squares.getRectangles()).toEqual([
        TileRectangle.of(1, 3, 2, 2, 0),
        TileRectangle.of(2, 2, 2, 2, 0)
    ])
})

// A "cross" of rectangles with a square in the middle
test('central-2x2-square-with-rectangles', () => {
    //     1   2   3   4   5
    // 1 |   | x | x |   |   |
    // 2 | x | x | x | x | x |
    // 3 | x | x | x | x | x |
    // 4 |   | x | x |   |   |
    // 5 |   | x | x |   |   |
    const tiles = [
        [1, 2], [1, 3],
        [2, 1], [2, 2], [2, 3], [2, 4], [2, 5],
        [3, 1], [3, 2], [3, 3], [3, 4], [3, 5],
        [4, 2], [4, 3], //[4, 4],
        [5, 2], [5, 3],
    ]
    const squares = cluster2square(createSet(tiles, 7))
    expect(squares.getSquareSize()).toBe(2)
    expect(squares.getRectangles()).toEqual([
        TileRectangle.of(1, 2, 5, 2, 7),
        TileRectangle.of(2, 1, 2, 5, 7)
    ])
})

test('three-overlapping-2x2-squares', () => {
    //     1   2   3   4
    // 1 |   |   | x | x |
    // 2 |   | x | x | x |
    // 3 | x | x | x |   |
    // 4 | x | x |   |   |
    const tiles = [
        [1, 3], [1, 4],
        [2, 2], [2, 3], [2, 4],
        [3, 1], [3, 2], [3, 3],
        [4, 1], [4, 2],
    ]
    const squares = cluster2square(createSet(tiles, 5))
    expect(squares.getSquareSize()).toBe(2)
    expect(squares.getRectangles()).toEqual([
        TileRectangle.of(1, 3, 2, 2, 5),
        TileRectangle.of(2, 2, 2, 2, 5),
        TileRectangle.of(3, 1, 2, 2, 5)
    ])
})

test('two-overlapping-3x3-squares', () => {
    //     1   2   3   4   5
    // 1 |   |   | x | x | x |
    // 2 | x |   | x | x | x |
    // 3 | x | x | x | x | x |
    // 4 | x | x | x | x |   |
    // 5 |   | x | x | x | x |
    const tiles = [
        [1, 2], [1, 3], [1, 4],
        [2, 3], [2, 4], [2, 5],
        [3, 1], [3, 2], [3, 3], [3, 4], [3, 5],
        [4, 1], [4, 2], [4, 3], [4, 4], [4, 5],
        [5, 1], [5, 2], [5, 3], [5, 5],
    ]
    const squares = cluster2square(createSet(tiles, 0))
    expect(squares.getSquareSize()).toBe(3)
    expect(squares.getRectangles()).toEqual([
        TileRectangle.of(2, 3, 3, 3, 0),
        TileRectangle.of(3, 1, 3, 3, 0)
    ])
})

test('two-detached-2x2-squares', () => {
    //     1   2   3   4   5
    // 1 |   |   |   | x | x |
    // 2 | x | x |   | x | x |
    // 3 | x | x |   | x | x |
    const tiles = [
        [1, 2], [1, 3],
        [2, 2], [2, 3],
        [4, 1], [4, 2], [4, 3],
        [5, 1], [5, 2], [5, 3],
    ]
    const squares = cluster2square(createSet(tiles, 7))
    expect(squares.getSquareSize()).toBe(2)
    expect(squares.getRectangles()).toEqual([
        TileRectangle.of(1, 2, 2, 2, 7),
        TileRectangle.of(4, 1, 2, 3, 7)
    ])
})

test('real-world-bug', () => {
    //     1   2   3   4   5   6   7
    // 1 |   |   |   | x | x | x | x |
    // 2 | x |   | x | x | x | x | x |
    // 3 | x | x | x |   |   | x |   |
    // 4 | x | x |   |   |   |   |   |
    // 5 | x | x |   |   |   |   |   |
    // The problem here was that the upper-right rectangle was started at column 6
    // (the first column higher than square size 2), but should start at column 4
    const tiles = [
        [1, 2], [1, 3], [1, 4], [1, 5],
        [2, 3], [2, 4], [2, 5],
        [3, 2], [3, 3],
        [4, 1], [4, 2],
        [5, 1], [5, 2],
        [6, 1], [6, 2], [6, 3],
        [7, 1], [7, 2],
    ]
    const squares = cluster2square(createSet(tiles, 0))
    expect(squares.getSquareSize()).toBe(2)
    expect(squares.getRectangles()).toEqual([
        TileRectangle.of(1, 3, 2, 3, 0),
        TileRectangle.of(4, 1, 4, 2, 0)
    ])
})
