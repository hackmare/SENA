import { CourseData, SKPaths } from '../types';
import { LatLonSpherical as LatLon } from '../lib/geodesy/latlon-spherical.js';
export declare function parseSKPaths(src: SKPaths): boolean;
export declare function calcs(src: SKPaths): CourseData;
export declare function vmg(src: SKPaths): number | null;
export declare function vmc(src: SKPaths, bearing: number, bearingType?: 'true' | 'magnetic'): number | null;
interface CourseTimes {
    nextPoint: {
        ttg: number | null;
        eta: string | null;
    };
    route: {
        ttg: number | null;
        eta: string | null;
        dtg: number | null;
    };
}
export declare function timeCalcs(src: SKPaths, distance: number, vmc: number, rhumbLine: boolean): CourseTimes;
export declare function targetSpeed(src: SKPaths, distance: number, rhumbLine?: boolean): number | null;
export declare function routeRemaining(src: SKPaths, rhumbLine?: boolean): number;
export declare function passedPerpendicular(vesselPosition: LatLon, destination: LatLon, startPoint: LatLon): boolean;
export {};
//# sourceMappingURL=course.d.ts.map