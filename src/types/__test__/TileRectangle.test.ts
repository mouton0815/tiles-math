import { TileRectangle } from '../TileRectangle'
import { Centroid } from '../Centroid'
import { TileSquare } from '../TileSquare'

test('rectangle-equals', () => {
    const one = TileRectangle.of(1, 1, 3, 3, 0)
    const two = TileRectangle.of(1, 1, 3, 2, 0)
    expect(one.equals(one)).toBe(true)
    expect(one.equals(two)).toBe(false)
})

test('rectangle-contains', () => {
    const outer = TileRectangle.of(1, 1, 3, 3, 0)
    const inner = TileRectangle.of(2, 2, 2, 2, 0)
    const aside = TileRectangle.of(2, 2, 4, 4, 0)
    expect(outer.contains(inner)).toBe(true)
    expect(outer.contains(outer)).toBe(true)
    expect(inner.contains(outer)).toBe(false)
    expect(outer.contains(aside)).toBe(false)
})

test('rectangle-strongly-contains', () => {
    const outer = TileRectangle.of(1, 1, 3, 3, 0)
    const inner = TileRectangle.of(2, 2, 2, 2, 0)
    const aside = TileRectangle.of(2, 2, 4, 4, 0)
    expect(outer.stronglyContains(inner)).toBe(true)
    expect(outer.stronglyContains(outer)).toBe(false)
    expect(inner.stronglyContains(outer)).toBe(false)
    expect(outer.contains(aside)).toBe(false)
})

test('rectangle-centroid', () => {
    expect(TileRectangle.of(1, 1, 1, 1, 5).centroid()).toEqual(Centroid.of(1.5, 1.5, 5))
    expect(TileRectangle.of(2, 2, 2, 2, 5).centroid()).toEqual(Centroid.of(3, 3, 5))
    expect(TileRectangle.of(3, 3, 3, 3, 5).centroid()).toEqual(Centroid.of(4.5, 4.5, 5))
    expect(TileRectangle.of(4, 4, 4, 4, 5).centroid()).toEqual(Centroid.of(6, 6, 5))
})

test('rectangle-squares-of-square', () => {
    const iter = TileRectangle.of(1, 1, 2, 2, 7).squares()
    expect([...iter]).toEqual([TileSquare.of(1, 1, 2, 7)])
})

test('rectangle-squares-of-horizontal-rectangle', () => {
    const iter = TileRectangle.of(2, 1, 4, 2, 7).squares() // Width 4, height 2
    expect([...iter]).toEqual([
        TileSquare.of(2, 1, 2, 7),
        TileSquare.of(3, 1, 2, 7),
        TileSquare.of(4, 1, 2, 7),
    ])
})

test('rectangle-squares-of-vertical-rectangle', () => {
    const iter = TileRectangle.of(1, 2, 2, 4, 0).squares() // Width 2, height 4
    expect([...iter]).toEqual([
        TileSquare.of(1, 2, 2, 0),
        TileSquare.of(1, 3, 2, 0),
        TileSquare.of(1, 4, 2, 0),
    ])
})