///
/// An edge as part of a {@link ClusterBoundary}.
///
export class ClusterEdge {
    x1: number
    y1: number
    x2: number
    y2: number

    constructor(x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
    }

    static of(x1: number, y1: number, x2: number, y2: number): ClusterEdge {
        return new ClusterEdge(x1, y1, x2, y2)
    }

    static upperEdge(x: number, y: number): ClusterEdge {
        return new ClusterEdge(x + 1, y, x, y) // Points to the left
    }

    static leftEdge(x: number, y: number): ClusterEdge {
        return new ClusterEdge(x, y, x, y + 1) // Points downwards
    }

    static lowerEdge(x: number, y: number): ClusterEdge {
        return new ClusterEdge(x, y + 1, x + 1, y + 1) // Points to the right
    }

    static rightEdge(x: number, y: number): ClusterEdge {
        return new ClusterEdge(x + 1, y + 1, x + 1, y) // Points upwards
    }
}