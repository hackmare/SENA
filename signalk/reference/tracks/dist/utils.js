"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInBounds = createInBounds;
exports.validateParameters = validateParameters;
exports.createDistanceTo = createDistanceTo;
exports.createMatcher = createMatcher;
var LAT = 0;
var LNG = 1;
// create function to check position against GeoBounds
function createInBounds(bounds) {
    var minLat = bounds.sw[LAT];
    var maxLat = bounds.ne[LAT];
    if (minLat > maxLat) {
        throw new Error("Bounding box south must be <=  north, got ".concat(JSON.stringify(bounds)));
    }
    var minLng = bounds.sw[LNG];
    var maxLng = (bounds.sw[LNG] > bounds.ne[LNG] ? 360 : 0) + bounds.ne[LNG];
    return function (p) {
        return (p !== null &&
            p[LAT] >= minLat &&
            p[LAT] <= maxLat &&
            ((p[LNG] >= minLng && p[LNG] <= maxLng) || (p[LNG] + 360 >= minLng && p[LNG] + 360 <= maxLng)));
    };
}
function validateParameters(params, defaultMaxRadius) {
    // bounding box lon1,lat1,lon2,lat2
    var bbox = null;
    if (typeof params.bbox !== 'undefined') {
        var b = params.bbox
            .split(',')
            .map(function (i) {
            if (!isNaN(i)) {
                return parseFloat(i);
            }
        })
            .filter(function (i) {
            if (typeof i === 'number')
                return i;
        });
        bbox = b.length == 4 ? { sw: [b[0], b[1]], ne: [b[2], b[3]] } : null;
    }
    var radius = null;
    // radius in meters
    if (typeof params.radius !== 'undefined') {
        radius = !isNaN(params.radius) ? parseFloat(params.radius) : null;
    }
    else if (defaultMaxRadius) {
        radius = defaultMaxRadius;
    }
    return { bbox: bbox, radius: radius };
}
//Create function to calculate distance to a point
function createDistanceTo(_a, debug) {
    var lat1d = _a[0], lon1d = _a[1];
    var Rk = 6371; // mean radius of the earth (km) at 39 degrees from the equator
    // convert coordinates to radians
    var lat1 = degreesToRadians(lat1d);
    var lon1 = degreesToRadians(lon1d);
    return function (dest) {
        if (!dest) {
            return Number.MAX_SAFE_INTEGER;
        }
        var lat2d = dest[0], lon2d = dest[1];
        var lat2 = degreesToRadians(lat2d);
        var lon2 = degreesToRadians(lon2d);
        // find the differences between the coordinates
        var dlat = lat2 - lat1;
        var dlon = lon2 - lon1;
        //** calculate **
        var a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var dk = c * Rk * 1000; // great circle distance in m
        if (debug && debug.enabled) {
            debug("".concat([lat2d, lon2d], " => ").concat(dk));
        }
        return dk;
    };
}
var degreesToRadians = function (value) {
    return (Math.PI / 180) * value;
};
function lastPoint(track) {
    return track.length ? track[track.length - 1] : null;
}
function createMatcher(params, selfPosition, debug) {
    if (params.bbox) {
        var inBounds_1 = createInBounds(params.bbox);
        return function (track) { return inBounds_1(lastPoint(track)); };
    }
    else if (params.radius !== null) {
        if (!selfPosition) {
            throw new Error('No self position to calculate radius values');
        }
        var distanceFromSelf_1 = createDistanceTo(selfPosition, debug);
        return function (track) { return distanceFromSelf_1(lastPoint(track)) < params.radius; };
    }
    return function () { return true; };
}
