import { TileRectangle } from '../types/TileRectangle'
import { Centroid } from '../types/Centroid'
import { TileSquare } from '../types/TileSquare'

/**
 * Provides the maximum square of a tile cluster computed with {@link cluster2square}.
 *
 * Because there may be several maximum squares embeddable into the tile cluster,
 * method {@link getCenterSquare} returns the square with the geometric center ({@link Centroid})
 * closest to the centroid of the surrounding tile cluster.
 *
 * Technically, this class stores rectangles where the shorter side equals the maximum square size.
 * This allows to display possible maximum-square extensions on the map.
 */
export class ClusterSquare {
    private readonly centroid: Centroid | null // The centroid of the source cluster
    private rectangles: Array<TileRectangle> // All rectangles with shorter side equal to squareSize
    private squareSize: number

    /**
     * Constructs a {@link ClusterSquare} object.
     * The passed {@link Centroid} may be null only if the source {@link TileSet} is empty.
     * @param centroid - the centroid of the source tile set.
     */
    constructor(centroid: Centroid | null) {
        this.centroid = centroid
        this.rectangles = new Array<TileRectangle>()
        this.squareSize = 0
    }

    /**
     * Adds a {@link TileRectangle} to the cluster.
     * @param newRectangle - the rectangle to add.
     */
    add(newRectangle: TileRectangle): this {
        const shorterSide = Math.min(newRectangle.w, newRectangle.h)
        if (shorterSide < this.squareSize) {
            return this // Ignore this rectangle as max square is already larger
        }
        if (shorterSide > this.squareSize) {
            this.squareSize = shorterSide
            this.rectangles = [] // Discard all existing rectangles that are "smaller" than newRectangle
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

    /**
     * Returns the set of rectangles added to this object.
     */
    getRectangles(): Array<TileRectangle> {
        return this.rectangles
    }

    /**
     * Returns the max {@link TileSquare} whose centroid has the closest distance to the cluster centroid.
     * The result can be null if the source {@link TileSet} was empty.
     */
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

    /**
     * Returns the size (number of tiles) of the max square.
     */
    getSquareSize(): number {
        return this.squareSize
    }

    /**
     * Similar to Array.map() function
     */
    mapRectangles<T>(callback: (rectangle: TileRectangle, index: number) => T): Array<T> {
        return this.rectangles.map(callback)
    }
}
