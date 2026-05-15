import type { BBox, FeatureCollection } from 'geojson';
import { ResourcesApi } from '@signalk/server-api';
import { ChartProvider } from './types';
export interface Tile {
    x: number;
    y: number;
    z: number;
}
export declare enum Status {
    Stopped = 0,
    Running = 1
}
export declare class ChartSeedingManager {
    static ActiveJobs: {
        [key: number]: ChartDownloader;
    };
    static createJob(resourcesApi: ResourcesApi, chartsPath: string, provider: ChartProvider, maxZoom: number, regionGUID?: string | undefined, bbox?: BBox | undefined, tile?: Tile | undefined): Promise<ChartDownloader>;
    static cancelAll(): void;
}
export declare class ChartDownloader {
    private resourcesApi;
    private chartsPath;
    private provider;
    private static MINIMUM_FREE_DISK_SPACE;
    private static nextJobId;
    private id;
    private status;
    private totalTiles;
    private downloadedTiles;
    private failedTiles;
    private cachedTiles;
    private concurrentDownloadsLimit;
    private areaDescription;
    private cancelRequested;
    private tiles;
    private tilesToDownload;
    constructor(resourcesApi: ResourcesApi, chartsPath: string, provider: ChartProvider);
    get ID(): number;
    initializeJobFromRegion(regionGUID: string, maxZoom: number): Promise<void>;
    initializeJobFromBBox(bbox: BBox, maxZoom: number): Promise<void>;
    initializeJobFromTile(tile: Tile, maxZoom: number): Promise<void>;
    private static DISK_CHECK_INTERVAL_MS;
    /**
     * Download map tiles for a specific area.
     */
    seedCache(): Promise<void>;
    deleteCache(): Promise<void>;
    cancelJob(): void;
    private filterCachedTiles;
    info(): {
        id: number;
        chartName: string;
        regionName: string;
        totalTiles: number;
        downloadedTiles: number;
        cachedTiles: number;
        failedTiles: number;
        progress: number;
        status: Status;
    };
    static getTileFromCacheOrRemote(chartsPath: string, provider: ChartProvider, tile: Tile): Promise<Buffer | null>;
    static fetchTileFromRemote(provider: ChartProvider, tile: Tile, timeoutMs?: number): Promise<Buffer | null>;
    getSubTiles(tile: Tile, maxZoom: number): Tile[];
    /**
     * Get all tiles that intersect a bounding box up to a maximum zoom level.
     * bbox = [minLon, minLat, maxLon, maxLat]
     */
    getTilesForBBox(bbox: BBox, maxZoom: number): Tile[];
    getTilesForGeoJSON(geojson: FeatureCollection, zoomMin?: number, zoomMax?: number): Tile[];
    private convertRegionToGeoJSON;
    private bboxPolygon;
}
//# sourceMappingURL=chartDownloader.d.ts.map