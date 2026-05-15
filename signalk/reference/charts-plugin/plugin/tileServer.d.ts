import { Response } from 'express';
import { ChartProvider } from './types';
/**
 * Tile-serving HTTP helpers for the charts plugin. Each helper terminates
 * the Express response itself; callers only pick the branch based on the
 * provider's storage format.
 */
export declare const MIN_ZOOM = 1;
export declare const MAX_ZOOM = 24;
export declare const MIN_TILE_Z = 0;
export declare const responseHttpOptions: {
    headers: {
        'Cache-Control': string;
    };
};
export declare const isAllowedTileFormat: (format: string | undefined) => boolean;
export declare const validateTileCoords: (z: number, x: number, y: number) => string | undefined;
export declare const validateMaxZoom: (maxZoom: number) => string | undefined;
export declare const validateBBox: (bbox: {
    minLon: unknown;
    minLat: unknown;
    maxLon: unknown;
    maxLat: unknown;
}) => string | undefined;
export declare const serveTileFromFilesystem: (res: Response, provider: ChartProvider, z: number, x: number, y: number) => void;
export declare const serveTileFromMbtiles: (res: Response, provider: ChartProvider, z: number, x: number, y: number) => void;
export declare const isMbtilesTileMissing: (err: Error) => boolean;
export declare const serveTileFromCacheOrRemote: (res: Response, cachePath: string, provider: ChartProvider, z: number, x: number, y: number) => Promise<void>;
//# sourceMappingURL=tileServer.d.ts.map