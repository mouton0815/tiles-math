import { BoundaryPolyline } from './BoundaryPolyline'
import { BoundarySegment } from './BoundarySegment'

/**
 * Helper class that wraps a polyline and holds the right-most point of the line.
 * The latter is used for excluding lines from attempts to join new lines to existing ones.
 */
class LineWrapper {
    line: BoundaryPolyline
    marginRight: number
    constructor(segment: BoundarySegment, zoom: number) {
        this.line = new BoundaryPolyline(segment, zoom)
        this.marginRight = Math.max(segment.x1, segment.x2)
    }
    tryPrependSegment(segment: BoundarySegment): boolean {
        if (this.line.tryPrependSegment(segment)) {
            this.marginRight = Math.max(this.marginRight, Math.max(segment.x1, segment.x2))
            return true
        }
        return false
    }
    tryAppendSegment(segment: BoundarySegment): boolean {
        if (this.line.tryAppendSegment(segment)) {
            this.marginRight = Math.max(this.marginRight, Math.max(segment.x1, segment.x2))
            return true
        }
        return false
    }
}

/**
 * Contains all {@link BoundaryPolyline}s of the defined the boundaries of a cluster.
 * Objects of this class are created by algorithm {@link cluster2boundaries}.
 * For consumers, read-only access is recommended.
 */
export class ClusterBoundaries {
    private readonly closed: Array<BoundaryPolyline>
    private active: Array<LineWrapper>

    constructor() {
        this.closed = new Array<BoundaryPolyline>()
        this.active = new Array<LineWrapper>()
    }

    addUpperEdge(x: number, y: number, zoom: number) {
        this.prepend(BoundarySegment.fromUpperEdge(x, y), zoom)
    }

    addLeftEdge(x: number, y: number, zoom: number) {
        this.append(BoundarySegment.fromLeftEdge(x, y), zoom)
    }

    addLowerEdge(x: number, y: number, zoom: number) {
        this.append(BoundarySegment.fromLowerEdge(x, y), zoom)
    }

    addRightEdge(x: number, y: number, zoom: number) {
        this.prepend(BoundarySegment.fromRightEdge(x, y), zoom)
    }

    /**
     * Internal method that searches for a matching polyline start to prepend the segment.
     * If a line was found, the method also tries to append the line to another matching line.
     * Otherwise, the method creates a new polyline with the segment.
     */
    private prepend(segment: BoundarySegment, zoom: number) {
        for (const [index, wrapper] of this.active.entries()) {
            if (wrapper.tryPrependSegment(segment)) {
                // Check if this line can be appended to another line
                this.tryAppendLine(wrapper.line, index)
                return
            }
        }
        this.active.push(new LineWrapper(segment, zoom))
    }

    /**
     * Internal method that searches for a matching polyline end to append the segment.
     * If a line was found, the method also tries to prepend the line to another matching line.
     * Otherwise, the method creates a new polyline with the segment.
     */
    private append(segment: BoundarySegment, zoom: number) {
        for (const [index, wrapper] of this.active.entries()) {
            if (wrapper.tryAppendSegment(segment)) {
                // Check if this line can be prepended to another line
                this.tryPrependLine(wrapper.line, index)
                return
            }
        }
        this.active.push(new LineWrapper(segment, zoom))
    }

    /**
     * Tries to append the passed line to any of the other processed lines.
     * Lines left of the current x position are not part of the array anymore,
     * see method {@link closeLeftOf}.
     * @param line - the line that shall be appended.
     * @param index - the index of the line in array {@link active}.
     */
    private tryAppendLine(line: BoundaryPolyline, index: number) {
        for (const [otherIndex, otherWrapper] of this.active.entries()) {
            if (otherIndex !== index && otherWrapper.line.tryAppendLine(line)) {
                this.active.splice(index, 1) // Line appended to another line, delete it
                break
            }
        }
    }

    /**
     * Tries to prepend the passed line to any of the other processed lines.
     * Lines left of the current x position are not part of the array anymore,
     * see method {@link closeLeftOf}.
     * @param line - the line that shall be prepended.
     * @param index - the index of the line in array {@link active}.
     */
    private tryPrependLine(line: BoundaryPolyline, index: number) {
        for (const [otherIndex, otherWrapper] of this.active.entries()) {
            if (otherIndex !== index && otherWrapper.line.tryPrependLine(line)) {
                this.active.splice(index, 1) // Line prepended to another line, delete it
                break
            }
        }
    }

    /**
     * Move all lines from array {@link active} to array {@link closed} whose right-most x position
     * is left of the passed x coordinate. Such lines cannot be candiates for joining.
     * @param x - the x coordinate to be compared with.
     */
    closeLeftOf(x: number) {
        this.active = this.active.filter(wrapper => {
            if (wrapper.marginRight < x) {
                this.closed.push(wrapper.line)
                return false
            }
            return true
        })
    }

    /**
     * Similar to Array.map() function.
     */
    map<T>(callback: (line: BoundaryPolyline, index: number) => T): Array<T> {
        let index = 0
        const results = new Array<T>()
        for (const line of this) { // Use *[Symbol.iterator]()
            results.push(callback(line, index++))
        }
        return results
    }

    /**
     * Iterates through the {@link BoundaryPolyline}s in creation order.
     */
    *[Symbol.iterator]() : Generator<BoundaryPolyline, void, undefined> {
        for (const line of this.closed) {
            yield line
        }
        for (const wrapper of this.active) {
            yield wrapper.line
        }
    }
}