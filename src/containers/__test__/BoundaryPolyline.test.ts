import { BoundaryPolyline } from '../BoundaryPolyline'
import { BoundarySegment } from '../../types/BoundarySegment'

test('boundary-single-outer', () => {
    const x = 2, y = 5
    const boundary = new BoundaryPolyline(BoundarySegment.fromUpperEdge(x, y), 7)
    expect(boundary.tryAppend(BoundarySegment.fromLeftEdge(x, y))).toBe(true)
    expect(boundary.tryAppend(BoundarySegment.fromLowerEdge(x, y))).toBe(true)
    expect(boundary.tryPrepend(BoundarySegment.fromRightEdge(x, y))).toBe(true)
    expect(boundary.isCircular()).toBe(true)
    expect(boundary.segments.length).toBe(4)
    expect(boundary.segments).toEqual([
        BoundarySegment.of(3, 6, 3, 5), // Right edge inserted at front
        BoundarySegment.of(3, 5, 2, 5), // Upper edge
        BoundarySegment.of(2, 5, 2, 6), // Left edge
        BoundarySegment.of(2, 6, 3, 6), // Lower edge
    ])
})

test('boundary-single-inner', () => {
    //     1   2   3
    // 1 | x | x | x |
    // 2 | x |   | x |
    // 3 | x | x | x |
    const boundary = new BoundaryPolyline(BoundarySegment.fromRightEdge(1, 2), 7)
    expect(boundary.tryAppend(BoundarySegment.fromLowerEdge(2, 1))).toBe(true)
    expect(boundary.tryPrepend(BoundarySegment.fromUpperEdge(2, 3))).toBe(true)
    expect(boundary.tryAppend(BoundarySegment.fromLeftEdge(3, 2))).toBe(true)
    expect(boundary.isCircular()).toBe(true)
    expect(boundary.segments.length).toBe(4)
    expect(boundary.segments).toEqual([
        BoundarySegment.of(3, 3, 2, 3), // Upper edge inserted at front
        BoundarySegment.of(2, 3, 2, 2), // Right edge
        BoundarySegment.of(2, 2, 3, 2), // Lower edge
        BoundarySegment.of(3, 2, 3, 3), // Left edge
    ])
})

test('boundary-merge-end-left', () => {
    const boundary = new BoundaryPolyline(BoundarySegment.fromLeftEdge(1, 1), 7)
    expect(boundary.tryAppend(BoundarySegment.fromLeftEdge(1, 2))).toBe(true)
    expect(boundary.tryAppend(BoundarySegment.fromLeftEdge(1, 3))).toBe(true)
    expect(boundary.isCircular()).toBe(false)
    expect(boundary.segments.length).toBe(1)
    expect(boundary.segments).toEqual([BoundarySegment.of(1, 1, 1, 4)])
})

test('boundary-merge-end-lower', () => {
    const boundary = new BoundaryPolyline(BoundarySegment.fromLowerEdge(1, 1), 7)
    expect(boundary.tryAppend(BoundarySegment.fromLowerEdge(2, 1))).toBe(true)
    expect(boundary.tryAppend(BoundarySegment.fromLowerEdge(3, 1))).toBe(true)
    expect(boundary.isCircular()).toBe(false)
    expect(boundary.segments.length).toBe(1)
    expect(boundary.segments).toEqual([BoundarySegment.of(1, 2, 4, 2)])
})

test('boundary-merge-start-right', () => {
    const boundary = new BoundaryPolyline(BoundarySegment.fromRightEdge(1, 1), 7)
    expect(boundary.tryPrepend(BoundarySegment.fromRightEdge(1, 2))).toBe(true)
    expect(boundary.tryPrepend(BoundarySegment.fromRightEdge(1, 3))).toBe(true)
    expect(boundary.isCircular()).toBe(false)
    expect(boundary.segments.length).toBe(1)
    expect(boundary.segments).toEqual([BoundarySegment.of(2, 4, 2, 1)])
})

test('boundary-merge-start-upper', () => {
    const boundary = new BoundaryPolyline(BoundarySegment.fromUpperEdge(1, 1), 7)
    expect(boundary.tryPrepend(BoundarySegment.fromUpperEdge(2, 1))).toBe(true)
    expect(boundary.tryPrepend(BoundarySegment.fromUpperEdge(3, 1))).toBe(true)
    expect(boundary.isCircular()).toBe(false)
    expect(boundary.segments.length).toBe(1)
    expect(boundary.segments).toEqual([BoundarySegment.of(4, 1, 1, 1)])
})

test('boundary-2x2-outer', () => {
    //     1   2
    // 1 | x | x |
    // 2 | x | x |
    const boundary = new BoundaryPolyline(BoundarySegment.fromUpperEdge(1, 1), 7)
    expect(boundary.tryAppend(BoundarySegment.fromLeftEdge(1, 1))).toBe(true)
    expect(boundary.tryAppend(BoundarySegment.fromLeftEdge(1, 2))).toBe(true)
    expect(boundary.tryAppend(BoundarySegment.fromLowerEdge(1, 2))).toBe(true)
    expect(boundary.tryPrepend(BoundarySegment.fromUpperEdge(2, 1))).toBe(true)
    expect(boundary.tryPrepend(BoundarySegment.fromRightEdge(2, 1))).toBe(true)
    expect(boundary.tryAppend(BoundarySegment.fromLowerEdge(2, 2))).toBe(true)
    expect(boundary.tryPrepend(BoundarySegment.fromRightEdge(2, 2))).toBe(true)
    expect(boundary.isCircular()).toBe(true)
    expect(boundary.segments.length).toBe(4)
    expect(boundary.segments).toEqual([
        BoundarySegment.of(3, 3, 3, 1),
        BoundarySegment.of(3, 1, 1, 1),
        BoundarySegment.of(1, 1, 1, 3),
        BoundarySegment.of(1, 3, 3, 3),
    ])
})
