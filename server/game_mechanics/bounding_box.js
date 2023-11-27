// This function defines the BoundingBox module.
// - `top` - The top side of the box
// - `left` - The left side of the box
// - `bottom` - The bottom side of the box
// - `right` - The right side of the box

// Context independent bounding box.
const BoundingBox = function(top, left, bottom, right) {

    // This is the path containing the bounding box.
    // It is initialized using the parameters of the function.
    //
    // `Path2D()` creates a new path that can be re-used by
    // the canvas context. This path is used to detect the
    // intersection of a point or a box against this
    // bounding box.

    /*
    const path = new Path2D();
    path.rect(left, top, right - left, bottom - top);
    */

    // This function gets the top side of the bounding box.
    const getTop = function() {
        return top;
    };

    // This function gets the left side of the bounding box.
    const getLeft = function() {
        return left;
    };

    // This function gets the bottom side of the bounding box.
    const getBottom = function() {
        return bottom;
    };

    // This function gets the right side of the bounding box.
    const getRight = function() {
        return right;
    };

    // functions to set points on boundning box
    const setTop = function(t){
        top = t;
    }

    const setBottom = function(b){
        bottom = b;
    }

    const setLeft = function(l){
        left = t;
    }

    const setRight = function(r){
        right = r;
    }

    // This function gets the four corner points of the bounding box.
    const getPoints = function() {
        return {
            topLeft: [left, top],
            topRight: [right, top],
            bottomLeft: [left, bottom],
            bottomRight: [right, bottom]
        };
    };

    // This function tests whether a point is in the bounding box.
    // - `x`, `y` - The (x, y) position to be tested

    /*
    const isPointInBox = function(x, y) {
        return ctx.isPointInPath(path, x, y);
    };
    */

    const isPointInBox = function(x, y){
        return (x >= left) && (x <= right) && (y >= top) && (y <= bottom);
    }

    // This function checks whether the two bounding boxes intersect.
    // - `box` - The other bounding box
    const intersect = function(box) {
        /* Check the points of the other box */
        let points = box.getPoints();
        for (const key in points) {
            if (isPointInBox(...points[key]))
                return true;
        }

        /* Check the points of this box */
        points = getPoints();
        for (const key in points) {
            if (box.isPointInBox(...points[key]))
                return true;
        }

        return false;
    };

    // This function generates a random point inside the bounding box.
    const randomPoint = function() {
        const x = left + (Math.random() * (right - left));
        const y = top + (Math.random() * (bottom - top));
        return {x, y};
    };

    // The methods are returned as an object here.
    return {
        getTop: getTop,
        getLeft: getLeft,
        getBottom: getBottom,
        getRight: getRight,
        getPoints: getPoints,
        isPointInBox: isPointInBox,
        intersect: intersect,
        randomPoint: randomPoint,
        setTop: setTop,
        setBottom: setBottom,
        setLeft: setLeft,
        setRight: setRight
    };
};

if(typeof(module) === "object")
    module.exports = {BoundingBox};
