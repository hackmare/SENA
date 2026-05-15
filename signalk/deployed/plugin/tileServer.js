"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveTileFromCacheOrRemote = exports.isMbtilesTileMissing = exports.serveTileFromMbtiles = exports.serveTileFromFilesystem = exports.validateBBox = exports.validateMaxZoom = exports.validateTileCoords = exports.isAllowedTileFormat = exports.responseHttpOptions = exports.MIN_TILE_Z = exports.MAX_ZOOM = exports.MIN_ZOOM = void 0;
const path_1 = __importDefault(require("path"));
const chartDownloader_1 = require("./chartDownloader");
/**
 * Tile-serving HTTP helpers for the charts plugin. Each helper terminates
 * the Express response itself; callers only pick the branch based on the
 * provider's storage format.
 */
// Provider-config zoom range: what we allow users to configure in the plugin
// settings for a chart's minzoom/maxzoom.
exports.MIN_ZOOM = 1;
exports.MAX_ZOOM = 24;
// Tile-coordinate range accepted on the HTTP tile route. Starts at zero
// because Leaflet's default minZoom is 0 — clients legitimately ask for
// the world tile when framing the initial view, even if no configured
// provider covers that level (they just get a 404 per-tile).
exports.MIN_TILE_Z = 0;
exports.responseHttpOptions = {
    headers: {
        'Cache-Control': 'public, max-age=7776000' // 90 days
    }
};
// Tile file extensions recognised on the filesystem path. Add new entries
// here when a new raster or vector format is supported.
const ALLOWED_TILE_FORMATS = new Set(['png', 'jpg', 'jpeg', 'pbf']);
const isAllowedTileFormat = (format) => {
    if (!format)
        return false;
    return ALLOWED_TILE_FORMATS.has(format.toLowerCase());
};
exports.isAllowedTileFormat = isAllowedTileFormat;
// Validates tile coordinates submitted by callers. Zoom is constrained to
// the range the plugin advertises; x/y must fit the zoom grid.
// Returns an error message if invalid, or undefined if OK.
const validateTileCoords = (z, x, y) => {
    if (!Number.isInteger(z) || z < exports.MIN_TILE_Z || z > exports.MAX_ZOOM) {
        return `Invalid zoom ${z} (must be an integer in [${exports.MIN_TILE_Z}, ${exports.MAX_ZOOM}])`;
    }
    const n = 2 ** z;
    if (!Number.isInteger(x) || x < 0 || x >= n) {
        return `Invalid x ${x} at zoom ${z} (must be an integer in [0, ${n}))`;
    }
    if (!Number.isInteger(y) || y < 0 || y >= n) {
        return `Invalid y ${y} at zoom ${z} (must be an integer in [0, ${n}))`;
    }
    return undefined;
};
exports.validateTileCoords = validateTileCoords;
const validateMaxZoom = (maxZoom) => {
    if (!Number.isFinite(maxZoom) || maxZoom < exports.MIN_ZOOM || maxZoom > exports.MAX_ZOOM) {
        return `Invalid maxZoom ${maxZoom} (must be in [${exports.MIN_ZOOM}, ${exports.MAX_ZOOM}])`;
    }
    return undefined;
};
exports.validateMaxZoom = validateMaxZoom;
// Validates a caller-supplied bounding box. Lat/Lon must be finite numbers in
// the real-world range; minLat must be below maxLat so downstream tile math
// doesn't silently iterate an empty or inverted span. minLon > maxLon is
// allowed — that's how antimeridian-crossing boxes are expressed.
const validateBBox = (bbox) => {
    const { minLon, minLat, maxLon, maxLat } = bbox;
    const finite = (v) => typeof v === 'number' && Number.isFinite(v);
    if (!finite(minLon) ||
        !finite(minLat) ||
        !finite(maxLon) ||
        !finite(maxLat)) {
        return 'bbox must contain finite numbers for minLon, minLat, maxLon, maxLat';
    }
    if (minLon < -180 || minLon > 180 || maxLon < -180 || maxLon > 180) {
        return 'bbox longitude must be in [-180, 180]';
    }
    if (minLat < -90 || minLat > 90 || maxLat < -90 || maxLat > 90) {
        return 'bbox latitude must be in [-90, 90]';
    }
    if (minLat >= maxLat) {
        return 'bbox minLat must be less than maxLat';
    }
    return undefined;
};
exports.validateBBox = validateBBox;
const serveTileFromFilesystem = (res, provider, z, x, y) => {
    const { format, _flipY, _filePath } = provider;
    const normalizedFormat = format?.toLowerCase() ?? '';
    if (!_filePath || !ALLOWED_TILE_FORMATS.has(normalizedFormat)) {
        res.sendStatus(404);
        return;
    }
    const flippedY = Math.pow(2, z) - 1 - y;
    const file = path_1.default.resolve(_filePath, `${z}/${x}/${_flipY ? flippedY : y}.${normalizedFormat}`);
    // sendFile already performs the stat and handles the error; the previous
    // stat+access probe duplicated that work on every tile request. Its
    // callback fires once per request with an err only when something went
    // wrong (missing file, permission denied, header-already-sent aborts).
    res.sendFile(file, exports.responseHttpOptions, (err) => {
        if (!err)
            return;
        const code = err.code;
        if (code === 'ENOENT' || code === 'EACCES' || code === 'EISDIR') {
            if (!res.headersSent)
                res.sendStatus(404);
        }
        else if (!res.headersSent) {
            res.sendStatus(500);
        }
    });
};
exports.serveTileFromFilesystem = serveTileFromFilesystem;
const serveTileFromMbtiles = (res, provider, z, x, y) => {
    if (!(0, exports.isAllowedTileFormat)(provider.format)) {
        res.sendStatus(404);
        return;
    }
    // Guard against a provider whose MBTiles handle is missing: openMbtilesFile
    // may have failed post-reconcile, or the handle was closed while a request
    // was in flight. Without this check, .getTile throws synchronously and
    // Express never answers the client.
    if (!provider._mbtilesHandle) {
        res.sendStatus(500);
        return;
    }
    provider._mbtilesHandle.getTile(z, x, y, (err, tile, headers) => {
        if (err && (0, exports.isMbtilesTileMissing)(err)) {
            res.sendStatus(404);
        }
        else if (err) {
            console.error(`Error fetching tile ${provider.identifier}/${z}/${x}/${y}:`, err);
            res.sendStatus(500);
        }
        else {
            headers['Cache-Control'] = exports.responseHttpOptions.headers['Cache-Control'];
            res.writeHead(200, headers);
            res.end(tile);
        }
    });
};
exports.serveTileFromMbtiles = serveTileFromMbtiles;
// @signalk/mbtiles currently throws `Error('Tile does not exist')` for a
// missing tile; some forks expose an ENOENT-style code instead. Centralise
// the check so a future library change only requires an edit here.
const isMbtilesTileMissing = (err) => {
    if (err.message === 'Tile does not exist')
        return true;
    const code = err.code;
    return code === 'ENOENT';
};
exports.isMbtilesTileMissing = isMbtilesTileMissing;
const serveTileFromCacheOrRemote = async (res, cachePath, provider, z, x, y) => {
    const buffer = await chartDownloader_1.ChartDownloader.getTileFromCacheOrRemote(cachePath, provider, { x, y, z });
    if (!buffer) {
        res.sendStatus(502);
        return;
    }
    res.set('Content-Type', `image/${provider.format}`);
    res.send(buffer);
};
exports.serveTileFromCacheOrRemote = serveTileFromCacheOrRemote;
//# sourceMappingURL=tileServer.js.map