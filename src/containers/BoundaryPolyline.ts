import { BoundarySegment } from '../types/BoundarySegment'
import { Coords } from '../types/Coords'
import { tile2coords } from '../algorithms/tile2coords'

export class BoundaryPolyline {
    segments: Array<BoundarySegment>

    /// Initializes a new cluster boundary with a start segment.
    constructor(segment: BoundarySegment) {
        this.segments = new Array<BoundarySegment>()
        this.segments.push(segment)
    }

    /// Appends the other line to this line.
    appendLine(other: BoundaryPolyline) {
        this.segments.push(...other.segments)
    }

    /// Appends the other line to this line.
    prependLine(other: BoundaryPolyline) {
        this.segments.unshift(...other.segments)
    }

    canPrepend(segment: BoundarySegment): boolean {
        const firstSegment = this.segments[0] // Array is never empty
        return segment.x2 === firstSegment.x1 && segment.y2 === firstSegment.y1
    }

    canAppend(segment: BoundarySegment): boolean {
        const lastSegment = this.segments[this.segments.length - 1] // Array is never empty
        return segment.x1 === lastSegment.x2 && segment.y1 === lastSegment.y2
    }

    /// Inserts the new segment before the start of this boundary if the end coordinates of the segment
    /// are equal to the start coordinates of the boundary. Returns true in this case and false otherwise.
    tryPrepend(segment: BoundarySegment): boolean {
        const firstSegment = this.segments[0] // Array is never empty
        if (segment.x2 === firstSegment.x1 && segment.y2 === firstSegment.y1) {
            if (segment.x1 === firstSegment.x2) { // segment has same direction as firstSegment: merge
                firstSegment.y1 = segment.y1
            } else if (segment.y1 === firstSegment.y2) { // ditto
                firstSegment.x1 = segment.x1
            } else {
                this.segments.unshift(segment)
            }
            return true
        }
        return false
    }

    /// Appends the new segment to the end of this boundary if the start coordinates of the new segment
    /// are equal to the end coordinates of the boundary. Returns true in this case and false otherwise.
    tryAppend(segment: BoundarySegment): boolean {
        const lastSegment = this.segments[this.segments.length - 1] // Array is never empty
        if (segment.x1 === lastSegment.x2 && segment.y1 === lastSegment.y2) {
            if (segment.x2 === lastSegment.x1) { // segment has same direction as lastSegment: merge
                lastSegment.y2 = segment.y2
            } else if (segment.y2 === lastSegment.y1) { // ditto
                lastSegment.x2 = segment.x2
            } else {
                this.segments.push(segment)
            }
            return true
        }
        return false
    }

    isCircular(): boolean {
        const firstSegment = this.segments[0]
        const lastSegment = this.segments[this.segments.length - 1]
        return firstSegment.x1 === lastSegment.x2 && firstSegment.y1 === lastSegment.y2
    }

    positions(zoom: number): Array<Coords> {
        const results = new Array<Coords>()
        let first = true
        for (const segment of this.segments) {
            if (first) {
                results.push(tile2coords(segment.x1, segment.y1, zoom))
                first = false
            }
            results.push(tile2coords(segment.x2, segment.y2, zoom))
        }
        return results
    }
}