import { BoundarySegment } from './BoundarySegment'
import { Coords } from '../types/Coords'
import { tile2coords } from '../algorithms/tile2coords'
import { TileNo } from '../types/TileNo'

/**
 * A polyline representing the boundaries of a tile cluster.
 * Method {@link positions} returns a sequence of positions that can be passed to Leaflet's Polyline map element.
 */
export class BoundaryPolyline {
    private readonly points: Array<TileNo>
    private readonly zoom: number

    /**
     * Initializes a new {@link BoundaryPolyline} with an initial segment.
     * @param segment - the initial segment of this polyline.
     * @param zoom - the zoom level of the tile cluster.
     */
    constructor(segment: BoundarySegment, zoom: number) {
        this.points = new Array<TileNo>()
        this.points.push({ x: segment.x1, y: segment.y1 })
        this.points.push({ x: segment.x2, y: segment.y2 })
        this.zoom = zoom
    }

    /**
     * Appends the other line to this line if the start point of the other line and the end point of this line match.
     * @param line - the line to append.
     * @returns true if the line was appended, false otherwise.
     */
    tryAppendLine(line: BoundaryPolyline) : boolean {
        const firstPoint = line.points[0]
        const lastPoint = this.points[this.points.length - 1] // Array is never empty
        if (firstPoint.x === lastPoint.x && firstPoint.y === lastPoint.y) {
            this.points.push(...line.points.slice(1))
            return true
        }
        return false
    }

    /**
     * Prepends the other line to this line if the end point of the other line and the start point of this line match.
     * @param line - the line to prepend.
     * @returns true if the line was prepended, false otherwise.
     */
    tryPrependLine(line: BoundaryPolyline) : boolean {
        const firstPoint = this.points[0]
        const lastPoint = line.points[line.points.length - 1] // Array is never empty
        if (firstPoint.x === lastPoint.x && firstPoint.y === lastPoint.y) {
            this.points.unshift(...line.points.slice(0, line.points.length - 1))
            return true
        }
        return false
    }

    /**
     * Inserts the new segment before the start of this boundary if the end coordinates of the segment
     * are equal to the start coordinates of the boundary line. Updates existing point instead of inserting
     * a new point if the new segment has the same direction as the start of the line.
     * @param segment - the {@link BoundarySegment} to prepend.
     * @returns true if the passed segment was prepended, false otherwise.
     * */
    tryPrependSegment(segment: BoundarySegment): boolean {
        const firstPoint = this.points[0] // Array always has at least two entries
        if (segment.x2 === firstPoint.x && segment.y2 === firstPoint.y) {
            const nextPoint = this.points[1]
            if (segment.x1 === nextPoint.x) { // Segment has same direction as firstSegment: update
                firstPoint.y = segment.y1
            } else if (segment.y1 === nextPoint.y) { // ditto
                firstPoint.x = segment.x1
            } else {
                this.points.unshift({ x: segment.x1, y: segment.y1 })
            }
            return true
        }
        return false
    }

    /**
     * Appends the new segment to the end of this boundary if the start coordinates of the new segment
     * are equal to the end coordinates of the boundary line. Updates existing point instead of inserting
     * a new point if the new segment has the same direction as the end of the line.
     * @param segment - the {@link BoundarySegment} to append.
     * @returns true if the passed segment was appended, false otherwise.
     */
    tryAppendSegment(segment: BoundarySegment): boolean {
        const lastPoint = this.points[this.points.length - 1] // Array always has at least two entries
        if (segment.x1 === lastPoint.x && segment.y1 === lastPoint.y) {
            const prevPoint = this.points[this.points.length - 2]
            if (segment.x2 === prevPoint.x) { // Segment has same direction as line: update
                lastPoint.y = segment.y2
            } else if (segment.y2 === prevPoint.y) { // ditto
                lastPoint.x = segment.x2
            } else {
                this.points.push({ x: segment.x2, y: segment.y2 })
            }
            return true
        }
        return false
    }

    /**
     * Checks if this polyline is circular, i.e. the start and end positions are equal.
     * @returns true if the polyline is circular, false otherwise.
     */
    isCircular(): boolean {
        const firstPoint = this.points[0]
        const lastPoint = this.points[this.points.length - 1]
        return firstPoint.x === lastPoint.x && firstPoint.y === lastPoint.y
    }

    /**
     * Returns a sequence of coordinates that can be passed to Leaflet's Polyline map element.
     */
    positions(): Array<Coords> {
        const results = new Array<Coords>()
        for (const { x, y } of this) { // Use Symbol.iterator
            results.push(tile2coords(x, y, this.zoom))
        }
        return results
    }

    /**
     * Iterates through the {@link TileNo} positions of this line.
     * @returns the yielded {@link TileNo}.
     */
    *[Symbol.iterator]() : Generator<TileNo, void, undefined> {
        for (const point of this.points) {
            yield point
        }
    }
}