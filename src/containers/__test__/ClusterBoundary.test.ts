import { ClusterBoundary } from '../ClusterBoundary'
import { ClusterEdge } from '../../types/ClusterEdge'

test('boundary-single-outer', () => {
    const x = 2, y = 5
    const boundary = new ClusterBoundary(ClusterEdge.upperEdge(x, y))
    expect(boundary.tryJoinEnd(ClusterEdge.leftEdge(x, y))).toBe(true)
    expect(boundary.tryJoinEnd(ClusterEdge.lowerEdge(x, y))).toBe(true)
    expect(boundary.tryJoinStart(ClusterEdge.rightEdge(x, y))).toBe(true)
    expect(boundary.isCircular()).toBe(true)
    expect(boundary.edges.length).toBe(4)
    expect(boundary.edges).toEqual([
        ClusterEdge.of(3, 6, 3, 5), // Right edge inserted at front
        ClusterEdge.of(3, 5, 2, 5), // Upper edge
        ClusterEdge.of(2, 5, 2, 6), // Left edge
        ClusterEdge.of(2, 6, 3, 6), // Lower edge
    ])
})

test('boundary-single-inner', () => {
    //     1   2   3
    // 1 | x | x | x |
    // 2 | x |   | x |
    // 3 | x | x | x |
    const boundary = new ClusterBoundary(ClusterEdge.rightEdge(1, 2))
    expect(boundary.tryJoinEnd(ClusterEdge.lowerEdge(2, 1))).toBe(true)
    expect(boundary.tryJoinStart(ClusterEdge.upperEdge(2, 3))).toBe(true)
    expect(boundary.tryJoinEnd(ClusterEdge.leftEdge(3, 2))).toBe(true)
    expect(boundary.isCircular()).toBe(true)
    expect(boundary.edges.length).toBe(4)
    expect(boundary.edges).toEqual([
        ClusterEdge.of(3, 3, 2, 3), // Upper edge inserted at front
        ClusterEdge.of(2, 3, 2, 2), // Right edge
        ClusterEdge.of(2, 2, 3, 2), // Lower edge
        ClusterEdge.of(3, 2, 3, 3), // Left edge
    ])
})

test('boundary-merge-end-left', () => {
    const boundary = new ClusterBoundary(ClusterEdge.leftEdge(1, 1))
    expect(boundary.tryJoinEnd(ClusterEdge.leftEdge(1, 2))).toBe(true)
    expect(boundary.tryJoinEnd(ClusterEdge.leftEdge(1, 3))).toBe(true)
    expect(boundary.isCircular()).toBe(false)
    expect(boundary.edges.length).toBe(1)
    expect(boundary.edges).toEqual([ClusterEdge.of(1, 1, 1, 4)])
})

test('boundary-merge-end-lower', () => {
    const boundary = new ClusterBoundary(ClusterEdge.lowerEdge(1, 1))
    expect(boundary.tryJoinEnd(ClusterEdge.lowerEdge(2, 1))).toBe(true)
    expect(boundary.tryJoinEnd(ClusterEdge.lowerEdge(3, 1))).toBe(true)
    expect(boundary.isCircular()).toBe(false)
    expect(boundary.edges.length).toBe(1)
    expect(boundary.edges).toEqual([ClusterEdge.of(1, 2, 4, 2)])
})

test('boundary-merge-start-right', () => {
    const boundary = new ClusterBoundary(ClusterEdge.rightEdge(1, 1))
    expect(boundary.tryJoinStart(ClusterEdge.rightEdge(1, 2))).toBe(true)
    expect(boundary.tryJoinStart(ClusterEdge.rightEdge(1, 3))).toBe(true)
    expect(boundary.isCircular()).toBe(false)
    expect(boundary.edges.length).toBe(1)
    expect(boundary.edges).toEqual([ClusterEdge.of(2, 4, 2, 1)])
})

test('boundary-merge-start-upper', () => {
    const boundary = new ClusterBoundary(ClusterEdge.upperEdge(1, 1))
    expect(boundary.tryJoinStart(ClusterEdge.upperEdge(2, 1))).toBe(true)
    expect(boundary.tryJoinStart(ClusterEdge.upperEdge(3, 1))).toBe(true)
    expect(boundary.isCircular()).toBe(false)
    expect(boundary.edges.length).toBe(1)
    expect(boundary.edges).toEqual([ClusterEdge.of(4, 1, 1, 1)])
})

test('boundary-2x2-outer', () => {
    //     1   2
    // 1 | x | x |
    // 2 | x | x |
    const boundary = new ClusterBoundary(ClusterEdge.upperEdge(1, 1))
    expect(boundary.tryJoinEnd(ClusterEdge.leftEdge(1, 1))).toBe(true)
    expect(boundary.tryJoinEnd(ClusterEdge.leftEdge(1, 2))).toBe(true)
    expect(boundary.tryJoinEnd(ClusterEdge.lowerEdge(1, 2))).toBe(true)
    expect(boundary.tryJoinStart(ClusterEdge.upperEdge(2, 1))).toBe(true)
    expect(boundary.tryJoinStart(ClusterEdge.rightEdge(2, 1))).toBe(true)
    expect(boundary.tryJoinEnd(ClusterEdge.lowerEdge(2, 2))).toBe(true)
    expect(boundary.tryJoinStart(ClusterEdge.rightEdge(2, 2))).toBe(true)
    expect(boundary.isCircular()).toBe(true)
    expect(boundary.edges.length).toBe(4)
    expect(boundary.edges).toEqual([
        ClusterEdge.of(3, 3, 3, 1),
        ClusterEdge.of(3, 1, 1, 1),
        ClusterEdge.of(1, 1, 1, 3),
        ClusterEdge.of(1, 3, 3, 3),
    ])
})
