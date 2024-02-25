import { ClusterSquare } from '../ClusterSquare'
import { TileRectangle } from '../../types/TileRectangle'
import { TileSquare } from '../../types/TileSquare'
import { Centroid } from '../../types/Centroid'

test('square-empty-get-center', () => {
    let squares = new ClusterSquare(Centroid.of(0, 0))
    expect(squares.getCenterSquare()).toBe(null)
})

test('square-get-center', () => {
    // Adds two overlapping rectangles (cross).
    // The result should be 6 squares of size 2.
    // The center square (centroid) should be in the middle of the cross.
    //     1   2   3   4   5
    // 1 |   |   | x | x |   |
    // 2 | x | x | x | x | x |
    // 3 | x | x | x | x | x |
    // 4 |   |   | x | x |   |
    expect(createForCentroid(Centroid.of(3.4, 2.5))).toEqual(TileSquare.of(2, 2, 2))
    expect(createForCentroid(Centroid.of(3.6, 2.5))).toEqual(TileSquare.of(3, 2, 2))
    expect(createForCentroid(Centroid.of(3.0, 1.6))).toEqual(TileSquare.of(3, 1, 2))
    expect(createForCentroid(Centroid.of(3.0, 2.1))).toEqual(TileSquare.of(2, 2, 2))
})

function createForCentroid(centroid: Centroid): TileSquare | null {
    const squares = new ClusterSquare(centroid)
    squares.add(TileRectangle.of(1, 2, 5, 2, 0))
    squares.add(TileRectangle.of(3, 1, 2, 4, 0))
    expect(squares.getSquareSize()).toBe(2)
    return squares.getCenterSquare()
}

test('rectangles-add-rectangle', () => {
    const squares = new ClusterSquare(null)
    squares.add(TileRectangle.of(1, 1, 2, 3, 0))
    expect(squares.getSquareSize()).toBe(2)
    expect(squares.getRectangles()).toEqual([TileRectangle.of(1, 1, 2, 3, 0)])
})

test('rectangles-rectangle-add-longer-short-side', () => {
    const squares = new ClusterSquare(null)
    squares.add(TileRectangle.of(1, 1, 2, 3, 0))
    squares.add(TileRectangle.of(1, 1, 3, 3, 0)) // Clears the array because the square size increases
    expect(squares.getSquareSize()).toBe(3)
    expect(squares.getRectangles()).toEqual([TileRectangle.of(1, 1, 3, 3, 0)])
})

test('square-add-rectangle-shorter-short-side', () => {
    const squares = new ClusterSquare(null)
    squares.add(TileRectangle.of(1, 1, 3, 3, 0))
    squares.add(TileRectangle.of(1, 1, 2, 3, 0)) // Ignored
    expect(squares.getSquareSize()).toBe(3)
    expect(squares.getRectangles()).toEqual([TileRectangle.of(1, 1, 3, 3, 0)])
})

test('square-add-rectangle-longer-long-side', () => {
    const squares = new ClusterSquare(null)
    squares.add(TileRectangle.of(2, 1, 2, 2, 0))
    squares.add(TileRectangle.of(1, 1, 4, 2, 0)) // Replaces the previous entry
    expect(squares.getSquareSize()).toBe(2)
    expect(squares.getRectangles()).toEqual([TileRectangle.of(1, 1, 4, 2, 0)])
})

test('square-add-rectangle-shorter-long-side', () => {
    const squares = new ClusterSquare(null)
    squares.add(TileRectangle.of(1, 1, 4, 2, 0))
    squares.add(TileRectangle.of(2, 1, 2, 2, 0)) // Ignored
    expect(squares.getSquareSize()).toBe(2)
    expect(squares.getRectangles()).toEqual([TileRectangle.of(1, 1, 4, 2, 0)])
})

test('square-overlapping-rectangles', () => {
    // Adds three overlapping rectangles
    //     1   2   3   4   5   6
    // 1 |   | x | x |   | x | x |
    // 2 | x | x | x | x | x | x |
    // 3 | x | x | x | x | x | x |
    // 4 |   | x | x |   | x | x |
    const squares = new ClusterSquare(null)
    squares.add(TileRectangle.of(1, 2, 6, 2, 0))
    squares.add(TileRectangle.of(2, 1, 2, 4, 0))
    squares.add(TileRectangle.of(5, 1, 2, 4, 0))
    expect(squares.getSquareSize()).toBe(2)
    expect(squares.getRectangles()).toEqual([
        TileRectangle.of(1, 2, 6, 2, 0),
        TileRectangle.of(2, 1, 2, 4, 0),
        TileRectangle.of(5, 1, 2, 4, 0)
    ])
})

test('square-map-rectangles', () => {
    const squares = new ClusterSquare(null)
    squares.add(TileRectangle.of(1, 1, 2, 3, 0))
    squares.add(TileRectangle.of(3, 1, 3, 2, 0))
    const results = squares.mapRectangles((rect, index) => rect.w + index)
    expect(results).toEqual([2, 4])
})
