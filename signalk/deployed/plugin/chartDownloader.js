"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartDownloader = exports.ChartSeedingManager = exports.Status = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const p_limit_1 = __importDefault(require("p-limit"));
const geojson_antimeridian_cut_1 = __importDefault(require("geojson-antimeridian-cut"));
const boolean_intersects_1 = __importDefault(require("@turf/boolean-intersects"));
const bbox_1 = require("@turf/bbox");
const helpers_1 = require("@turf/helpers");
const check_disk_space_1 = __importDefault(require("check-disk-space"));
const projection_1 = require("./projection");
const tileServer_1 = require("./tileServer");
var Status;
(function (Status) {
    Status[Status["Stopped"] = 0] = "Stopped";
    Status[Status["Running"] = 1] = "Running";
})(Status || (exports.Status = Status = {}));
class ChartSeedingManager {
    static ActiveJobs = {};
    static async createJob(resourcesApi, chartsPath, provider, maxZoom, regionGUID = undefined, bbox = undefined, tile = undefined) {
        const downloader = new ChartDownloader(resourcesApi, chartsPath, provider);
        // Init must complete before the job is usable; callers get back a job that
        // knows its tile set and totalTiles. Without awaiting, a follow-up "start"
        // action would race the init reads of this.tiles.
        if (regionGUID)
            await downloader.initializeJobFromRegion(regionGUID, maxZoom);
        else if (bbox)
            await downloader.initializeJobFromBBox(bbox, maxZoom);
        else if (tile)
            await downloader.initializeJobFromTile(tile, maxZoom);
        else
            throw new Error('createJob requires regionGUID, bbox, or tile');
        this.ActiveJobs[downloader.ID] = downloader;
        return downloader;
    }
    // Cancel all running jobs and clear the registry. Used when the plugin stops
    // so a disabled plugin doesn't keep pulling tiles in the background.
    static cancelAll() {
        for (const job of Object.values(this.ActiveJobs)) {
            job.cancelJob();
        }
        this.ActiveJobs = {};
    }
}
exports.ChartSeedingManager = ChartSeedingManager;
class ChartDownloader {
    resourcesApi;
    chartsPath;
    provider;
    static MINIMUM_FREE_DISK_SPACE = 1024 * 1024 * 1024; // 1 GB
    static nextJobId = 1;
    id = ChartDownloader.nextJobId++;
    status = Status.Stopped;
    totalTiles = 0;
    downloadedTiles = 0;
    failedTiles = 0;
    cachedTiles = 0;
    concurrentDownloadsLimit = 20;
    areaDescription = '';
    cancelRequested = false;
    tiles = [];
    tilesToDownload = [];
    constructor(resourcesApi, chartsPath, provider) {
        this.resourcesApi = resourcesApi;
        this.chartsPath = chartsPath;
        this.provider = provider;
    }
    get ID() {
        return this.id;
    }
    async initializeJobFromRegion(regionGUID, maxZoom) {
        const region = (await this.resourcesApi.getResource('regions', regionGUID));
        const geojson = this.convertRegionToGeoJSON(region);
        this.tiles = this.getTilesForGeoJSON(geojson, this.provider.minzoom, maxZoom);
        this.tilesToDownload = await this.filterCachedTiles(this.tiles);
        this.status = Status.Stopped;
        this.totalTiles = this.tiles.length;
        this.cachedTiles = this.totalTiles - this.tilesToDownload.length;
        this.areaDescription = `Region: ${region?.name ?? ''}`;
    }
    async initializeJobFromBBox(bbox, maxZoom) {
        this.tiles = this.getTilesForBBox(bbox, maxZoom);
        this.tilesToDownload = await this.filterCachedTiles(this.tiles);
        this.status = Status.Stopped;
        this.totalTiles = this.tiles.length;
        this.cachedTiles = this.totalTiles - this.tilesToDownload.length;
        this.areaDescription = `BBox: [${bbox.join(', ')}]`;
    }
    async initializeJobFromTile(tile, maxZoom) {
        this.tiles = this.getSubTiles(tile, maxZoom);
        this.tilesToDownload = await this.filterCachedTiles(this.tiles);
        this.status = Status.Stopped;
        this.totalTiles = this.tiles.length;
        this.cachedTiles = this.totalTiles - this.tilesToDownload.length;
        this.areaDescription = `Tile: [${tile.x}, ${tile.y}, ${tile.z}]`;
    }
    static DISK_CHECK_INTERVAL_MS = 30_000;
    /**
     * Download map tiles for a specific area.
     */
    async seedCache() {
        // Guard against double-start: a second call while Running would share
        // counters and concurrency slots with the first and corrupt progress.
        if (this.status === Status.Running)
            return;
        this.cancelRequested = false;
        this.status = Status.Running;
        this.tilesToDownload = await this.filterCachedTiles(this.tiles);
        this.downloadedTiles = 0;
        this.failedTiles = 0;
        this.cachedTiles = this.totalTiles - this.tilesToDownload.length;
        const limit = (0, p_limit_1.default)(this.concurrentDownloadsLimit); // concurrent download limit
        let lastDiskCheck = 0;
        const tasks = this.tilesToDownload.map((tile) => limit(async () => {
            if (this.cancelRequested)
                return;
            // Time-based (rather than tile-count-based) disk-space probing: a
            // tight per-1000-tile cadence fired hundreds of times on a large
            // bbox, whereas real disk consumption grows with wall-clock time.
            const now = Date.now();
            if (now - lastDiskCheck >= ChartDownloader.DISK_CHECK_INTERVAL_MS) {
                lastDiskCheck = now;
                try {
                    const { free } = await (0, check_disk_space_1.default)(this.chartsPath);
                    if (free < ChartDownloader.MINIMUM_FREE_DISK_SPACE) {
                        console.warn(`Low disk space. Stopping download.`);
                        this.cancelRequested = true;
                        return;
                    }
                }
                catch (err) {
                    console.error(`Error checking disk space:`, err);
                    this.cancelRequested = true;
                    return;
                }
            }
            const buffer = await ChartDownloader.getTileFromCacheOrRemote(this.chartsPath, this.provider, tile);
            // Re-check after the await: the job may have been cancelled while the
            // fetch was in flight. Still-running fetches would otherwise keep
            // mutating counters after status flips to Stopped.
            if (this.cancelRequested)
                return;
            if (buffer === null) {
                this.failedTiles++;
            }
            else {
                this.downloadedTiles++;
            }
        }));
        // allSettled ensures every in-flight task completes before we flip back
        // to Stopped; Promise.all would resolve on the first rejection while
        // other tasks still incremented counters in the background.
        const results = await Promise.allSettled(tasks);
        for (const r of results) {
            if (r.status === 'rejected') {
                console.error('Error downloading tile:', r.reason);
            }
        }
        this.status = Status.Stopped;
    }
    async deleteCache() {
        this.status = Status.Running;
        for (const tile of this.tiles) {
            if (this.cancelRequested)
                break;
            const tilePath = path_1.default.join(this.chartsPath, `${this.provider.name}`, `${tile.z}`, `${tile.x}`, `${tile.y}.${this.provider.format}`);
            try {
                await fs_1.default.promises.unlink(tilePath);
                this.cachedTiles = Math.max(this.cachedTiles - 1, 0);
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    console.error(`Error deleting cached tile ${tilePath}:`, err);
                }
            }
        }
        this.status = Status.Stopped;
    }
    cancelJob() {
        this.cancelRequested = true;
    }
    async filterCachedTiles(allTiles) {
        // Bound the concurrent fs.access calls. 100k+ tiles in a large bbox would
        // otherwise fire all accesses at once, risking EMFILE on default rlimit
        // and spiking the event loop.
        const limit = (0, p_limit_1.default)(64);
        const checks = allTiles.map((tile) => limit(async () => {
            const tilePath = path_1.default.join(this.chartsPath, this.provider.name, `${tile.z}`, `${tile.x}`, `${tile.y}.${this.provider.format}`);
            try {
                await fs_1.default.promises.access(tilePath); // file exists
                return null; // filter out cached tile
            }
            catch (err) {
                if (err.code === 'ENOENT') {
                    return tile; // file does not exist → uncached
                }
                console.error('Unexpected fs error:', err);
                return tile; // treat unknown errors as uncached
            }
        }));
        const results = await Promise.all(checks);
        return results.filter((t) => t !== null);
    }
    info() {
        return {
            id: this.id,
            chartName: this.provider.name,
            regionName: this.areaDescription,
            totalTiles: this.totalTiles,
            downloadedTiles: this.downloadedTiles,
            cachedTiles: this.cachedTiles,
            failedTiles: this.failedTiles,
            progress: this.totalTiles > 0
                ? (this.downloadedTiles + this.cachedTiles + this.failedTiles) /
                    this.totalTiles
                : 0,
            status: this.status
        };
    }
    static async getTileFromCacheOrRemote(chartsPath, provider, tile) {
        const tilePath = path_1.default.join(chartsPath, `${provider.name}`, `${tile.z}`, `${tile.x}`, `${tile.y}.${provider.format}`);
        try {
            const data = await fs_1.default.promises.readFile(tilePath);
            return data;
        }
        catch (err) {
            //Cache miss, proceed to fetch from remote
        }
        const buffer = await this.fetchTileFromRemote(provider, tile);
        if (buffer) {
            try {
                await fs_1.default.promises.mkdir(path_1.default.dirname(tilePath), { recursive: true });
                await fs_1.default.promises.writeFile(tilePath, buffer);
            }
            catch (err) {
                console.error(`Error writing tile ${tilePath}:`, err);
            }
        }
        return buffer;
    }
    static async fetchTileFromRemote(provider, tile, timeoutMs = 5000) {
        // Local (non-proxy) providers have no remoteUrl; the POST /cache endpoint
        // is open to any provider, so callers can still land here and should get
        // a well-defined null rather than a crash.
        if (!provider.remoteUrl) {
            return null;
        }
        let url = provider.remoteUrl
            .replace('{z}', tile.z.toString())
            // To be able to handle NOAA WMTS caching as a tilemap source with -2 offset
            .replace('{z-2}', (tile.z - 2).toString())
            .replace('{x}', tile.x.toString())
            .replace('{y}', tile.y.toString())
            .replace('{-y}', (Math.pow(2, tile.z) - 1 - tile.y).toString());
        // Support {bbox} (EPSG:4326) and {bbox_3857} (EPSG:3857) for WMS-style sources.
        // {bbox} emits minLon,minLat,maxLon,maxLat — this is WMS 1.1.1 order, and also
        // matches WMS 1.3.0 for projected CRSes. For WMS 1.3.0 with a geographic CRS
        // (e.g. EPSG:4326) the spec requires lat,lon axis order; prefer {bbox_3857} in
        // that case, or use a WMS 1.1.1 endpoint.
        if (url.includes('{bbox}') || url.includes('{bbox_3857}')) {
            const [minLon, minLat, maxLon, maxLat] = (0, projection_1.tileToBBox)(tile.x, tile.y, tile.z);
            if (url.includes('{bbox}')) {
                url = url.replace('{bbox}', `${minLon},${minLat},${maxLon},${maxLat}`);
            }
            if (url.includes('{bbox_3857}')) {
                const [mx1, my1] = (0, projection_1.lonLatToMercator)(minLon, minLat);
                const [mx2, my2] = (0, projection_1.lonLatToMercator)(maxLon, maxLat);
                url = url.replace('{bbox_3857}', `${mx1},${my1},${mx2},${my2}`);
            }
        }
        // If URL looks like a bare WMS endpoint (no tile placeholders were replaced),
        // auto-generate proper WMS GetMap request parameters
        if (url === provider.remoteUrl) {
            const [minLon, minLat, maxLon, maxLat] = (0, projection_1.tileToBBox)(tile.x, tile.y, tile.z);
            const params = new URLSearchParams({
                SERVICE: 'WMS',
                REQUEST: 'GetMap',
                VERSION: '1.1.1',
                BBOX: `${minLon},${minLat},${maxLon},${maxLat}`,
                CRS: 'EPSG:4326',
                WIDTH: '256',
                HEIGHT: '256',
                LAYERS: provider.layers || '',
                FORMAT: 'image/png',
                STYLES: ''
            });
            const separator = url.includes('?') ? '&' : '?';
            url = url + separator + params.toString();
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(url, {
                headers: provider.headers,
                signal: controller.signal
            });
            // Clear the abort timer as soon as the response head is in. A long body
            // read was otherwise racing the timeout and could be aborted mid-stream
            // while the caller waited on arrayBuffer().
            clearTimeout(timeoutId);
            if (!response.ok) {
                return null;
            }
            const arrayBuffer = await response.arrayBuffer();
            return Buffer.from(arrayBuffer);
        }
        catch (_err) {
            clearTimeout(timeoutId);
            return null;
        }
    }
    getSubTiles(tile, maxZoom) {
        const tiles = [tile];
        for (let z = tile.z + 1; z <= maxZoom; z++) {
            const zoomDiff = z - tile.z;
            const factor = Math.pow(2, zoomDiff);
            const startX = tile.x * factor;
            const startY = tile.y * factor;
            for (let x = startX; x < startX + factor; x++) {
                for (let y = startY; y < startY + factor; y++) {
                    tiles.push({ x, y, z });
                }
            }
        }
        return tiles;
    }
    /**
     * Get all tiles that intersect a bounding box up to a maximum zoom level.
     * bbox = [minLon, minLat, maxLon, maxLat]
     */
    getTilesForBBox(bbox, maxZoom) {
        const tiles = [];
        const [minLon, minLat, maxLon, maxLat] = bbox;
        const crossesAntiMeridian = minLon > maxLon;
        // Respect the provider's minzoom: low zooms outside the provider's range
        // would 404 from the remote and just inflate totalTiles.
        const minZoom = Math.max(tileServer_1.MIN_ZOOM, this.provider.minzoom ?? tileServer_1.MIN_ZOOM);
        // Helper to process a lon/lat box normally. lonLatToTileXY returns
        // tile-Y increasing southward, so for a box with minLat < maxLat the
        // south edge yields the larger tile-Y.
        const processBBox = (lo1, la1, lo2, la2) => {
            for (let z = minZoom; z <= maxZoom; z++) {
                const [minX, maxY] = (0, projection_1.lonLatToTile)(lo1, la1, z); // SW corner
                const [maxX, minY] = (0, projection_1.lonLatToTile)(lo2, la2, z); // NE corner
                for (let x = minX; x <= maxX; x++) {
                    for (let y = minY; y <= maxY; y++) {
                        tiles.push({ x, y, z });
                    }
                }
            }
        };
        if (!crossesAntiMeridian) {
            // normal
            processBBox(minLon, minLat, maxLon, maxLat);
        }
        else {
            // crosses antimeridian — split into two boxes:
            // [minLon -> 180] and [-180 -> maxLon]
            processBBox(minLon, minLat, 180, maxLat);
            processBBox(-180, minLat, maxLon, maxLat);
        }
        return tiles;
    }
    getTilesForGeoJSON(geojson, zoomMin = 1, zoomMax = 14) {
        const tiles = [];
        for (const feature of geojson.features) {
            if (feature.geometry.type !== 'Polygon' &&
                feature.geometry.type !== 'MultiPolygon') {
                console.warn('Skipping non-polygon feature');
                continue;
            }
            const boundingBox = (0, bbox_1.bbox)(feature.geometry); // [minX, minY, maxX, maxY]
            for (let z = zoomMin; z <= zoomMax; z++) {
                const [minX, minY] = (0, projection_1.lonLatToTile)(boundingBox[0], boundingBox[3], z); // top-left
                const [maxX, maxY] = (0, projection_1.lonLatToTile)(boundingBox[2], boundingBox[1], z); // bottom-right
                for (let x = minX; x <= maxX; x++) {
                    for (let y = minY; y <= maxY; y++) {
                        // Cheap AABB pre-filter avoids allocating a turf polygon and
                        // running booleanIntersects for tiles that can't possibly
                        // overlap the feature's bbox. Saves 90%+ of the turf work on
                        // concave regions.
                        const [tMinLon, tMinLat, tMaxLon, tMaxLat] = (0, projection_1.tileToBBox)(x, y, z);
                        if (tMaxLon < boundingBox[0] ||
                            tMinLon > boundingBox[2] ||
                            tMaxLat < boundingBox[1] ||
                            tMinLat > boundingBox[3]) {
                            continue;
                        }
                        const tilePoly = this.bboxPolygon([
                            tMinLon,
                            tMinLat,
                            tMaxLon,
                            tMaxLat
                        ]);
                        if ((0, boolean_intersects_1.default)(feature, tilePoly)) {
                            tiles.push({ x, y, z });
                        }
                    }
                }
            }
        }
        return tiles;
    }
    convertRegionToGeoJSON(region) {
        const feature = region.feature;
        if (!feature || feature.type !== 'Feature' || !feature.geometry) {
            throw new Error('Invalid region: missing feature or geometry');
        }
        const geoFeature = {
            type: 'Feature',
            id: feature.id || undefined,
            geometry: feature.geometry,
            properties: {
                name: region.name || '',
                description: region.description || '',
                timestamp: region.timestamp || '',
                source: region.$source || '',
                ...(feature.properties || {})
            }
        };
        const splitGeoFeature = (0, geojson_antimeridian_cut_1.default)(geoFeature);
        const features = [];
        const pushFeaturePolygon = (orig, coords, idx) => {
            const poly = {
                type: 'Feature',
                id: idx != null && orig.id ? `${orig.id}-${idx}` : orig.id,
                geometry: {
                    type: 'Polygon',
                    coordinates: coords
                },
                properties: orig.properties || {}
            };
            features.push(poly);
        };
        const f = splitGeoFeature;
        if (f.geometry && f.geometry.type === 'MultiPolygon') {
            const coords = f.geometry.coordinates;
            coords.forEach((ring, i) => pushFeaturePolygon(f, ring, i));
        }
        else if (f.geometry && f.geometry.type === 'Polygon') {
            features.push(f);
        }
        return {
            type: 'FeatureCollection',
            features
        };
    }
    bboxPolygon(boundingBox) {
        const [minLon, minLat, maxLon, maxLat] = boundingBox;
        return (0, helpers_1.polygon)([
            [
                [minLon, minLat],
                [maxLon, minLat],
                [maxLon, maxLat],
                [minLon, maxLat],
                [minLon, minLat]
            ]
        ]);
    }
}
exports.ChartDownloader = ChartDownloader;
//# sourceMappingURL=chartDownloader.js.map