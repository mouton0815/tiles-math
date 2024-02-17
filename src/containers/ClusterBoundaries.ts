import { BoundaryPolyline } from './BoundaryPolyline'
import { BoundarySegment } from '../types/BoundarySegment'

///
/// Contains all polylines the defined the boundaries of a cluster.
///
export class ClusterBoundaries {
    boundaries: Array<BoundaryPolyline>
    constructor() {
        this.boundaries = new Array<BoundaryPolyline>()
    }

    prepend(segment: BoundarySegment) {
        for (const boundary of this.boundaries) {
            if (boundary.tryPrepend(segment)) {
                return
            }
        }
        this.boundaries.push(new BoundaryPolyline(segment))
    }

    append(segment: BoundarySegment) {
        for (const boundary of this.boundaries) {
            if (boundary.tryAppend(segment)) {
                return
            }
        }
        this.boundaries.push(new BoundaryPolyline(segment))
    }
}