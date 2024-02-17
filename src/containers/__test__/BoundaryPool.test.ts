import { BoundarySegment } from '../../types/BoundarySegment'
import { ClusterBoundaries } from '../ClusterBoundaries'

test('boundary-pool-outer-inner', () => {
    //     1   2   3
    // 1 | x | x | x |
    // 2 | x |   | x |
    // 3 | x | x | x |
    const pool = new ClusterBoundaries()
    pool.prepend(BoundarySegment.fromUpperEdge(1, 1))
    pool.append(BoundarySegment.fromLeftEdge(1, 1))
    pool.append(BoundarySegment.fromLeftEdge(1, 2))
    pool.prepend(BoundarySegment.fromRightEdge(1, 2))
    pool.append(BoundarySegment.fromLeftEdge(1, 3))
    pool.append(BoundarySegment.fromLowerEdge(1, 3))
    pool.prepend(BoundarySegment.fromUpperEdge(2, 1))
    pool.append(BoundarySegment.fromLowerEdge(2, 1))
    pool.prepend(BoundarySegment.fromUpperEdge(2, 3))
    pool.append(BoundarySegment.fromLowerEdge(2, 3))
    pool.prepend(BoundarySegment.fromUpperEdge(3, 1))
    pool.prepend(BoundarySegment.fromRightEdge(3, 1))
    pool.append(BoundarySegment.fromLeftEdge(3, 2))
    pool.prepend(BoundarySegment.fromRightEdge(3, 2))
    pool.append(BoundarySegment.fromLowerEdge(3, 3))
    pool.prepend(BoundarySegment.fromRightEdge(3, 3))
    expect(pool.boundaries.length).toBe(2)
    expect(pool.boundaries[0].segments).toEqual([
        BoundarySegment.of(4, 4, 4, 1), // Right segment
        BoundarySegment.of(4, 1, 1, 1), // Upper segment
        BoundarySegment.of(1, 1, 1, 4), // Left segment
        BoundarySegment.of(1, 4, 4, 4), // Lower segment
    ])
    expect(pool.boundaries[1].segments).toEqual([
        BoundarySegment.of(3, 3, 2, 3), // Upper segment
        BoundarySegment.of(2, 3, 2, 2), // Right segment
        BoundarySegment.of(2, 2, 3, 2), // Lower segment
        BoundarySegment.of(3, 2, 3, 3), // Left segment
    ])
})
