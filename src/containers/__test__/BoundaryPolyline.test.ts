import { BoundaryPolyline } from '../BoundaryPolyline'
import { BoundarySegment } from '../BoundarySegment'

test('boundary-merge-end-left', () => {
    const boundary = new BoundaryPolyline(BoundarySegment.fromLeftEdge(1, 1), 7)
    expect(boundary.tryAppend(BoundarySegment.fromLeftEdge(1, 2))).toBe(true)
    expect(boundary.tryAppend(BoundarySegment.fromLeftEdge(1, 3))).toBe(true)
    expect(boundary.isCircular()).toBe(false)
    const positions = [...boundary]
    expect(positions.length).toBe(2)
    expect(positions).toEqual([{ x: 1, y: 1 }, { x: 1, y: 4 } ])
})

test('boundary-merge-end-lower', () => {
    const boundary = new BoundaryPolyline(BoundarySegment.fromLowerEdge(1, 1), 7)
    expect(boundary.tryAppend(BoundarySegment.fromLowerEdge(2, 1))).toBe(true)
    expect(boundary.tryAppend(BoundarySegment.fromLowerEdge(3, 1))).toBe(true)
    expect(boundary.isCircular()).toBe(false)
    const positions = [...boundary]
    expect(positions.length).toBe(2)
    expect(positions).toEqual([{ x: 1, y: 2 }, { x: 4, y: 2 } ])
})

test('boundary-merge-start-right', () => {
    const boundary = new BoundaryPolyline(BoundarySegment.fromRightEdge(1, 1), 7)
    expect(boundary.tryPrepend(BoundarySegment.fromRightEdge(1, 2))).toBe(true)
    expect(boundary.tryPrepend(BoundarySegment.fromRightEdge(1, 3))).toBe(true)
    expect(boundary.isCircular()).toBe(false)
    const positions = [...boundary]
    expect(positions.length).toBe(2)
    expect(positions).toEqual([{ x: 2, y: 4 }, { x: 2, y: 1 } ])
})

test('boundary-merge-start-upper', () => {
    const boundary = new BoundaryPolyline(BoundarySegment.fromUpperEdge(1, 1), 7)
    expect(boundary.tryPrepend(BoundarySegment.fromUpperEdge(2, 1))).toBe(true)
    expect(boundary.tryPrepend(BoundarySegment.fromUpperEdge(3, 1))).toBe(true)
    expect(boundary.isCircular()).toBe(false)
    const positions = [...boundary]
    expect(positions.length).toBe(2)
    expect(positions).toEqual([{ x: 4, y: 1 }, { x: 1, y: 1 } ])
})

test('boundary-single-outer', () => {
    const x = 2, y = 5
    const boundary = new BoundaryPolyline(BoundarySegment.fromUpperEdge(x, y), 7)
    expect(boundary.tryAppend(BoundarySegment.fromLeftEdge(x, y))).toBe(true)
    expect(boundary.tryAppend(BoundarySegment.fromLowerEdge(x, y))).toBe(true)
    expect(boundary.tryPrepend(BoundarySegment.fromRightEdge(x, y))).toBe(true)
    expect(boundary.isCircular()).toBe(true)
    const positions = [...boundary]
    expect(positions.length).toBe(5)
    expect(positions).toEqual([
        { x: 3, y: 6 }, // Lower right
        { x: 3, y: 5 }, // Upper right
        { x: 2, y: 5 }, // Upper left
        { x: 2, y: 6 }, // Lower legt
        { x: 3, y: 6 }, // Circle
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
    const positions = [...boundary]
    expect(positions.length).toBe(5)
    expect(positions).toEqual([
        { x: 3, y: 3 }, // Lower right
        { x: 2, y: 3 }, // Lower left
        { x: 2, y: 2 }, // Upper left
        { x: 3, y: 2 }, // Upper right
        { x: 3, y: 3 }, // Circle
    ])
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
    const positions = [...boundary]
    expect(positions.length).toBe(5)
    expect(positions).toEqual([
        { x: 3, y: 3 }, // Lower right
        { x: 3, y: 1 }, // Upper right
        { x: 1, y: 1 }, // Upper left
        { x: 1, y: 3 }, // Lower left
        { x: 3, y: 3 }, // Circle
    ])
})
