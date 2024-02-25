import { TileRectangle } from '../types/TileRectangle'
import { Centroid } from '../types/Centroid'
import { TileSquare } from '../types/TileSquare'

///
/// Provides the maximum square of a tile cluster computed with {@link cluster2square}.
///
/// Because there may be several maximum squares embeddable into the tile cluster,
/// method {@link getCenterSquare} returns the square with the geometric center (centroid) closest
/// to the centroid of the surrounding tile cluster.
///
/// Technically, this class stores rectangles where the shorter side equals the maximum square size.
/// This allows to display possible maximum-square extensions on the map.
///
export class ClusterSquare {
    centroid: Centroid | null // The centroid of the source cluster
    squareSize: number
    rectangles: Array<TileRectangle> // All rectangles with shorter side equal to squareSize

    /// The centroid may be null only if the source cluster is empty
    constructor(centroid: Centroid | null) {
        this.centroid = centroid
        this.squareSize = 0
        this.rectangles = new Array<TileRectangle>()
    }

    add(newRectangle: TileRectangle): this {
        const shorterSide = Math.min(newRectangle.w, newRectangle.h)
        if (shorterSide < this.squareSize) {
            return this // Ignore this rectangle as max square is already larger
        }
        if (shorterSide > this.squareSize) {
            this.squareSize = shorterSide
            this.rectangles = []
        }
        // There may be several rectangles that have the same square size (the length of the shorter rectangle side)
        // and are contained in each other. In this case, keep only the rectangle with the longest longer side.
        let found = false
        for (const [index, rectangle] of this.rectangles.entries()) {
            if (rectangle.contains(newRectangle)) {
                found = true
                break
            } else if (newRectangle.stronglyContains(rectangle)) {
                this.rectangles[index] = newRectangle // Replace existing rectangle by larger one
                found = true
                break
            }
        }
        if (!found) {
            this.rectangles.push(newRectangle)
        }
        return this
    }

    getRectangles(): Array<TileRectangle> {
        return this.rectangles
    }

    /// Returns the square whose centroid has the closest distance to the cluster centroid
    getCenterSquare(): TileSquare | null {
        let closest : TileSquare | null = null
        if (this.centroid !== null) {
            let minDist = Number.MAX_SAFE_INTEGER
            for (const rectangle of this.rectangles) {
                for (const square of rectangle.squares()) {
                    const distance = square.distanceTo(this.centroid)
                    if (closest === null || distance < minDist) {
                        closest = square
                        minDist = distance
                    }
                }
            }
        }
        return closest
    }

    getSquareSize(): number {
        return this.squareSize
    }

    /// Similar to Array.map() function
    mapRectangles<T>(callback: (rectangle: TileRectangle, index: number) => T): Array<T> {
        return this.rectangles.map(callback)
    }
}
