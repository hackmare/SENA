/**
 * Library of geodesy functions for operations on a spherical earth model.
 *
 * Includes distances, bearings, destinations, etc, for both great circle paths and rhumb lines,
 * and other related functions.
 *
 * All calculations are done using simple spherical trigonometric formulae.
 *
 * @module latlon-spherical
 */
/**
 * Latitude/longitude points on a spherical model earth, and methods for calculating distances,
 * bearings, destinations, etc on (orthodromic) great-circle paths and (loxodromic) rhumb lines.
 */
export class LatLonSpherical {
    /** Conversion factors; 1000 * LatLon.metresToKm gives 1. */
    static get metresToKm(): number;
    /** Conversion factors; 1000 * LatLon.metresToMiles gives 0.621371192237334. */
    static get metresToMiles(): number;
    /** Conversion factors; 1000 * LatLon.metresToMiles gives 0.5399568034557236. */
    static get metresToNauticalMiles(): number;
    /**
     * Parses a latitude/longitude point from a variety of formats.
     *
     * Latitude & longitude (in degrees) can be supplied as two separate parameters, as a single
     * comma-separated lat/lon string, or as a single object with { lat, lon } or GeoJSON properties.
     *
     * The latitude/longitude values may be numeric or strings; they may be signed decimal or
     * deg-min-sec (hexagesimal) suffixed by compass direction (NSEW); a variety of separators are
     * accepted. Examples -3.62, '3 37 12W', '3°37′12″W'.
     *
     * Thousands/decimal separators must be comma/dot; use Dms.fromLocale to convert locale-specific
     * thousands/decimal separators.
     *
     * @param   {number|string|Object} lat|latlon - Latitude (in degrees) or comma-separated lat/lon or lat/lon object.
     * @param   {number|string}        [lon]      - Longitude (in degrees).
     * @returns {LatLon} Latitude/longitude point.
     * @throws  {TypeError} Invalid point.
     *
     * @example
     *   const p1 = LatLon.parse(52.205, 0.119);                                    // numeric pair (≡ new LatLon)
     *   const p2 = LatLon.parse('52.205', '0.119');                                // numeric string pair (≡ new LatLon)
     *   const p3 = LatLon.parse('52.205, 0.119');                                  // single string numerics
     *   const p4 = LatLon.parse('52°12′18.0″N', '000°07′08.4″E');                  // DMS pair
     *   const p5 = LatLon.parse('52°12′18.0″N, 000°07′08.4″E');                    // single string DMS
     *   const p6 = LatLon.parse({ lat: 52.205, lon: 0.119 });                      // { lat, lon } object numeric
     *   const p7 = LatLon.parse({ lat: '52°12′18.0″N', lng: '000°07′08.4″E' });    // { lat, lng } object DMS
     *   const p8 = LatLon.parse({ type: 'Point', coordinates: [ 0.119, 52.205] }); // GeoJSON
     */
    static parse(...args: any[]): LatLon;
    /**
     * Returns the point of intersection of two paths defined by point and bearing.
     *
     * @param   {LatLon}      p1 - First point.
     * @param   {number}      brng1 - Initial bearing from first point.
     * @param   {LatLon}      p2 - Second point.
     * @param   {number}      brng2 - Initial bearing from second point.
     * @returns {LatLon|null} Destination point (null if no unique intersection defined).
     *
     * @example
     *   const p1 = new LatLon(51.8853, 0.2545), brng1 = 108.547;
     *   const p2 = new LatLon(49.0034, 2.5735), brng2 =  32.435;
     *   const pInt = LatLon.intersection(p1, brng1, p2, brng2); // 50.9078°N, 004.5084°E
     */
    static intersection(p1: LatLon, brng1: number, p2: LatLon, brng2: number): LatLon | null;
    /**
     * Returns the pair of meridians at which a great circle defined by two points crosses the given
     * latitude. If the great circle doesn't reach the given latitude, null is returned.
     *
     * @param   {LatLon}      point1 - First point defining great circle.
     * @param   {LatLon}      point2 - Second point defining great circle.
     * @param   {number}      latitude - Latitude crossings are to be determined for.
     * @returns {Object|null} Object containing { lon1, lon2 } or null if given latitude not reached.
     */
    static crossingParallels(point1: LatLon, point2: LatLon, latitude: number): Object | null;
    /**
     * Calculates the area of a spherical polygon where the sides of the polygon are great circle
     * arcs joining the vertices.
     *
     * @param   {LatLon[]} polygon - Array of points defining vertices of the polygon.
     * @param   {number}   [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
     * @returns {number}   The area of the polygon in the same units as radius.
     *
     * @example
     *   const polygon = [new LatLon(0,0), new LatLon(1,0), new LatLon(0,1)];
     *   const area = LatLon.areaOf(polygon); // 6.18e9 m²
     */
    static areaOf(polygon: LatLon[], radius?: number): number;
    /**
     * Creates a latitude/longitude point on the earth’s surface, using a spherical model earth.
     *
     * @param  {number} lat - Latitude (in degrees).
     * @param  {number} lon - Longitude (in degrees).
     * @throws {TypeError} Invalid lat/lon.
     *
     * @example
     *   import LatLon from '/js/geodesy/latlon-spherical.js';
     *   const p = new LatLon(52.205, 0.119);
     */
    constructor(lat: number, lon: number);
    _lat: any;
    _lon: any;
    set lat(lat: any);
    /**
     * Latitude in degrees north from equator (including aliases lat, latitude): can be set as
     * numeric or hexagesimal (deg-min-sec); returned as numeric.
     */
    get lat(): any;
    set latitude(lat: any);
    get latitude(): any;
    set lon(lon: any);
    /**
     * Longitude in degrees east from international reference meridian (including aliases lon, lng,
     * longitude): can be set as numeric or hexagesimal (deg-min-sec); returned as numeric.
     */
    get lon(): any;
    set lng(lon: any);
    get lng(): any;
    set longitude(lon: any);
    get longitude(): any;
    /**
     * Returns the distance along the surface of the earth from ‘this’ point to destination point.
     *
     * Uses haversine formula: a = sin²(Δφ/2) + cosφ1·cosφ2 · sin²(Δλ/2); d = 2 · atan2(√a, √(a-1)).
     *
     * @param   {LatLon} point - Latitude/longitude of destination point.
     * @param   {number} [radius=6371e3] - Radius of earth (defaults to mean radius in metres).
     * @returns {number} Distance between this point and destination point, in same units as radius.
     * @throws  {TypeError} Invalid radius.
     *
     * @example
     *   const p1 = new LatLon(52.205, 0.119);
     *   const p2 = new LatLon(48.857, 2.351);
     *   const d = p1.distanceTo(p2);       // 404.3×10³ m
     *   const m = p1.distanceTo(p2, 3959); // 251.2 miles
     */
    distanceTo(point: LatLon, radius?: number): number;
    /**
     * Returns the initial bearing from ‘this’ point to destination point.
     *
     * @param   {LatLon} point - Latitude/longitude of destination point.
     * @returns {number} Initial bearing in degrees from north (0°..360°).
     *
     * @example
     *   const p1 = new LatLon(52.205, 0.119);
     *   const p2 = new LatLon(48.857, 2.351);
     *   const b1 = p1.initialBearingTo(p2); // 156.2°
     */
    initialBearingTo(point: LatLon): number;
    /**
     * Returns final bearing arriving at destination point from ‘this’ point; the final bearing will
     * differ from the initial bearing by varying degrees according to distance and latitude.
     *
     * @param   {LatLon} point - Latitude/longitude of destination point.
     * @returns {number} Final bearing in degrees from north (0°..360°).
     *
     * @example
     *   const p1 = new LatLon(52.205, 0.119);
     *   const p2 = new LatLon(48.857, 2.351);
     *   const b2 = p1.finalBearingTo(p2); // 157.9°
     */
    finalBearingTo(point: LatLon): number;
    /**
     * Returns the midpoint between ‘this’ point and destination point.
     *
     * @param   {LatLon} point - Latitude/longitude of destination point.
     * @returns {LatLon} Midpoint between this point and destination point.
     *
     * @example
     *   const p1 = new LatLon(52.205, 0.119);
     *   const p2 = new LatLon(48.857, 2.351);
     *   const pMid = p1.midpointTo(p2); // 50.5363°N, 001.2746°E
     */
    midpointTo(point: LatLon): LatLon;
    /**
     * Returns the point at given fraction between ‘this’ point and given point.
     *
     * @param   {LatLon} point - Latitude/longitude of destination point.
     * @param   {number} fraction - Fraction between the two points (0 = this point, 1 = specified point).
     * @returns {LatLon} Intermediate point between this point and destination point.
     *
     * @example
     *   const p1 = new LatLon(52.205, 0.119);
     *   const p2 = new LatLon(48.857, 2.351);
     *   const pInt = p1.intermediatePointTo(p2, 0.25); // 51.3721°N, 000.7073°E
     */
    intermediatePointTo(point: LatLon, fraction: number): LatLon;
    /**
     * Returns the destination point from ‘this’ point having travelled the given distance on the
     * given initial bearing (bearing normally varies around path followed).
     *
     * @param   {number} distance - Distance travelled, in same units as earth radius (default: metres).
     * @param   {number} bearing - Initial bearing in degrees from north.
     * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
     * @returns {LatLon} Destination point.
     *
     * @example
     *   const p1 = new LatLon(51.47788, -0.00147);
     *   const p2 = p1.destinationPoint(7794, 300.7); // 51.5136°N, 000.0983°W
     */
    destinationPoint(distance: number, bearing: number, radius?: number): LatLon;
    /**
     * Returns (signed) distance from ‘this’ point to great circle defined by start-point and
     * end-point.
     *
     * @param   {LatLon} pathStart - Start point of great circle path.
     * @param   {LatLon} pathEnd - End point of great circle path.
     * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
     * @returns {number} Distance to great circle (-ve if to left, +ve if to right of path).
     *
     * @example
     *   const pCurrent = new LatLon(53.2611, -0.7972);
     *   const p1 = new LatLon(53.3206, -1.7297);
     *   const p2 = new LatLon(53.1887, 0.1334);
     *   const d = pCurrent.crossTrackDistanceTo(p1, p2);  // -307.5 m
     */
    crossTrackDistanceTo(pathStart: LatLon, pathEnd: LatLon, radius?: number): number;
    /**
     * Returns how far ‘this’ point is along a path from from start-point, heading towards end-point.
     * That is, if a perpendicular is drawn from ‘this’ point to the (great circle) path, the
     * along-track distance is the distance from the start point to where the perpendicular crosses
     * the path.
     *
     * @param   {LatLon} pathStart - Start point of great circle path.
     * @param   {LatLon} pathEnd - End point of great circle path.
     * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
     * @returns {number} Distance along great circle to point nearest ‘this’ point.
     *
     * @example
     *   const pCurrent = new LatLon(53.2611, -0.7972);
     *   const p1 = new LatLon(53.3206, -1.7297);
     *   const p2 = new LatLon(53.1887,  0.1334);
     *   const d = pCurrent.alongTrackDistanceTo(p1, p2);  // 62.331 km
     */
    alongTrackDistanceTo(pathStart: LatLon, pathEnd: LatLon, radius?: number): number;
    /**
     * Returns maximum latitude reached when travelling on a great circle on given bearing from
     * ‘this’ point (‘Clairaut’s formula’). Negate the result for the minimum latitude (in the
     * southern hemisphere).
     *
     * The maximum latitude is independent of longitude; it will be the same for all points on a
     * given latitude.
     *
     * @param   {number} bearing - Initial bearing.
     * @returns {number} Maximum latitude reached.
     */
    maxLatitude(bearing: number): number;
    /**
     * Returns the distance travelling from ‘this’ point to destination point along a rhumb line.
     *
     * @param   {LatLon} point - Latitude/longitude of destination point.
     * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
     * @returns {number} Distance in km between this point and destination point (same units as radius).
     *
     * @example
     *   const p1 = new LatLon(51.127, 1.338);
     *   const p2 = new LatLon(50.964, 1.853);
     *   const d = p1.distanceTo(p2); //  40.31 km
     */
    rhumbDistanceTo(point: LatLon, radius?: number): number;
    /**
     * Returns the bearing from ‘this’ point to destination point along a rhumb line.
     *
     * @param   {LatLon}    point - Latitude/longitude of destination point.
     * @returns {number}    Bearing in degrees from north.
     *
     * @example
     *   const p1 = new LatLon(51.127, 1.338);
     *   const p2 = new LatLon(50.964, 1.853);
     *   const d = p1.rhumbBearingTo(p2); // 116.7°
     */
    rhumbBearingTo(point: LatLon): number;
    /**
     * Returns the destination point having travelled along a rhumb line from ‘this’ point the given
     * distance on the given bearing.
     *
     * @param   {number} distance - Distance travelled, in same units as earth radius (default: metres).
     * @param   {number} bearing - Bearing in degrees from north.
     * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
     * @returns {LatLon} Destination point.
     *
     * @example
     *   const p1 = new LatLon(51.127, 1.338);
     *   const p2 = p1.rhumbDestinationPoint(40300, 116.7); // 50.9642°N, 001.8530°E
     */
    rhumbDestinationPoint(distance: number, bearing: number, radius?: number): LatLon;
    /**
     * Returns the loxodromic midpoint (along a rhumb line) between ‘this’ point and second point.
     *
     * @param   {LatLon} point - Latitude/longitude of second point.
     * @returns {LatLon} Midpoint between this point and second point.
     *
     * @example
     *   const p1 = new LatLon(51.127, 1.338);
     *   const p2 = new LatLon(50.964, 1.853);
     *   const pMid = p1.rhumbMidpointTo(p2); // 51.0455°N, 001.5957°E
     */
    rhumbMidpointTo(point: LatLon): LatLon;
    /**
     * Checks if another point is equal to ‘this’ point.
     *
     * @param   {LatLon} point - Point to be compared against this point.
     * @returns {bool}   True if points have identical latitude and longitude values.
     *
     * @example
     *   const p1 = new LatLon(52.205, 0.119);
     *   const p2 = new LatLon(52.205, 0.119);
     *   const equal = p1.equals(p2); // true
     */
    equals(point: LatLon): bool;
    /**
     * Converts ‘this’ point to a GeoJSON object.
     *
     * @returns {Object} this point as a GeoJSON ‘Point’ object.
     */
    toGeoJSON(): Object;
    /**
     * Returns a string representation of ‘this’ point, formatted as degrees, degrees+minutes, or
     * degrees+minutes+seconds.
     *
     * @param   {string} [format=d] - Format point as 'd', 'dm', 'dms', or 'n' for signed numeric.
     * @param   {number} [dp=4|2|0] - Number of decimal places to use: default 4 for d, 2 for dm, 0 for dms.
     * @returns {string} Comma-separated formatted latitude/longitude.
     * @throws  {RangeError} Invalid format.
     *
     * @example
     *   const greenwich = new LatLon(51.47788, -0.00147);
     *   const d = greenwich.toString();                        // 51.4779°N, 000.0015°W
     *   const dms = greenwich.toString('dms', 2);              // 51°28′40.37″N, 000°00′05.29″W
     *   const [lat, lon] = greenwich.toString('n').split(','); // 51.4779, -0.0015
     */
    toString(format?: string, dp?: number): string;
}
export const Dms: any;
//# sourceMappingURL=latlon-spherical.d.ts.map