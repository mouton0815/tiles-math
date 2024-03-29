/**
 * An edge as part of a {@link BoundaryPolyline} (internal type).
 */
export class BoundarySegment {
    readonly x1: number
    readonly y1: number
    readonly x2: number
    readonly y2: number

    constructor(x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
    }

    static fromUpperEdge(x: number, y: number): BoundarySegment {
        return new BoundarySegment(x + 1, y, x, y) // Points to the left
    }

    static fromLeftEdge(x: number, y: number): BoundarySegment {
        return new BoundarySegment(x, y, x, y + 1) // Points downwards
    }

    static fromLowerEdge(x: number, y: number): BoundarySegment {
        return new BoundarySegment(x, y + 1, x + 1, y + 1) // Points to the right
    }

    static fromRightEdge(x: number, y: number): BoundarySegment {
        return new BoundarySegment(x + 1, y + 1, x + 1, y) // Points upwards
    }
}