import { BoundarySegment } from '../../types/BoundarySegment'
import { ClusterBoundaries } from '../ClusterBoundaries'

test('boundary-boundaries-outer-inner', () => {
    //     1   2   3
    // 1 | x | x | x |
    // 2 | x |   | x |
    // 3 | x | x | x |
    const boundaries = new ClusterBoundaries()
    boundaries.addUpperEdge(1, 1)
    boundaries.addLeftEdge(1, 1)
    boundaries.addLeftEdge(1, 2)
    boundaries.addRightEdge(1, 2)
    boundaries.addLeftEdge(1, 3)
    boundaries.addLowerEdge(1, 3)
    boundaries.addUpperEdge(2, 1)
    boundaries.addLowerEdge(2, 1)
    boundaries.addUpperEdge(2, 3)
    boundaries.addLowerEdge(2, 3)
    boundaries.addUpperEdge(3, 1)
    boundaries.addRightEdge(3, 1)
    boundaries.addLeftEdge(3, 2)
    boundaries.addRightEdge(3, 2)
    boundaries.addLowerEdge(3, 3)
    boundaries.addRightEdge(3, 3)
    expect(boundaries.array.length).toBe(2)
    // Outer boundary
    expect(boundaries.array[0].segments).toEqual([
        BoundarySegment.of(4, 4, 4, 1), // Right segment
        BoundarySegment.of(4, 1, 1, 1), // Upper segment
        BoundarySegment.of(1, 1, 1, 4), // Left segment
        BoundarySegment.of(1, 4, 4, 4), // Lower segment
    ])
    // Inner boundary
    expect(boundaries.array[1].segments).toEqual([
        BoundarySegment.of(3, 3, 2, 3), // Lower segment
        BoundarySegment.of(2, 3, 2, 2), // Left segment
        BoundarySegment.of(2, 2, 3, 2), // Upper segment
        BoundarySegment.of(3, 2, 3, 3), // Right segment
    ])
})
