import type { BBox } from 'geojson';
export declare const WEB_MERCATOR_HALF_EXTENT_M = 20037508.34;
export declare const WEB_MERCATOR_MAX_LAT = 85.0511287798;
export declare function tileToBBox(x: number, y: number, z: number): BBox;
export declare function lonLatToMercator(lon: number, lat: number): [number, number];
export declare function lonLatToTile(lon: number, lat: number, zoom: number): [number, number];
//# sourceMappingURL=projection.d.ts.map