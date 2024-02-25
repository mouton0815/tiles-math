import { TileSquare } from '../TileSquare'
import { Centroid } from '../Centroid'

test('square-equals', () => {
    const one = TileSquare.of(1, 1, 3, 0)
    const two = TileSquare.of(1, 1, 2, 0)
    expect(one.equals(one)).toBe(true)
    expect(one.equals(two)).toBe(false)
})

test('square-centroid', () => {
    expect(TileSquare.of(1, 1, 1, 0).centroid()).toEqual(Centroid.of(1.5, 1.5))
    expect(TileSquare.of(2, 2, 2, 0).centroid()).toEqual(Centroid.of(3, 3))
    expect(TileSquare.of(3, 3, 3, 0).centroid()).toEqual(Centroid.of(4.5, 4.5))
    expect(TileSquare.of(4, 4, 4, 0).centroid()).toEqual(Centroid.of(6, 6))
})

test('square-distanceTo', () => {
    const square = TileSquare.of(1, 1, 4, 0) // Centroid: 3, 3
    const centroid = Centroid.of(5, 5)
    expect(square.distanceTo(centroid)).toBe(Math.sqrt(8)) // Dist: sqrt((3-5)^2 + (3-5)^2)
})
