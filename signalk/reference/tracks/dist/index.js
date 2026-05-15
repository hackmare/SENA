"use strict";
/*
 * Copyright 2021 Teppo Kurki <teppo.kurki@iki.fi>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackAccumulator = exports.Tracks = void 0;
exports.default = ThePlugin;
var tracks_1 = require("./tracks");
var utils_1 = require("./utils");
var toLngLat = function (_a) {
    var lat = _a[0], lng = _a[1];
    return [lng, lat];
};
var DEFAULT_RESOLUTION = 60000;
var DEFAULT_POINTS_TO_KEEP = 60 * 2; // 2 hours with default resolution
var DEFAULT_MAX_AGE = 60 * 10; // ten minutes
var DEFAULT_MAX_RADIUS = 50 * 1000; //50 kilometers
// Bootstrap retry configuration:
// First attempt after 5s (sufficient for warm restarts where InfluxDB is already running).
// Subsequent attempts every 15s, up to 18 total (~260s window), covering cold boot scenarios
// where InfluxDB may take 2+ minutes to accept connections after systemd reports it active.
var BOOTSTRAP_INITIAL_DELAY = 5000;
var BOOTSTRAP_RETRY_DELAY = 15000;
var BOOTSTRAP_MAX_ATTEMPTS = 18;
// If getHistoryApi() reports "no provider configured" this many times consecutively,
// assume no history provider plugin is installed and stop retrying.
var BOOTSTRAP_MAX_NO_PROVIDER = 3;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var isNumeric = function (x) { return x - parseInt(x) + 1 >= 0; };
var notAvailable = function (res) {
    res.status(404);
    res.json({ message: 'Tracks API not available because tracks plugin is not enabled' });
};
var sleep = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var errorDetail = function (err) {
    return err && err.stack ? err.stack : String(err);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var isNoProviderError = function (err) {
    return String(err).indexOf('No history') !== -1 && String(err).indexOf('provider') !== -1;
};
function bootstrapSelfTrack(app, tracks, config) {
    return __awaiter(this, void 0, void 0, function () {
        var debug, resolution, pointsToKeep, timespanMs, resolutionSecs, noProviderCount, attempt, delay, historyApi, to, from, response, positions, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    debug = app.debug;
                    if (!app.getHistoryApi) {
                        debug('getHistoryApi not available on server, skipping track bootstrap');
                        return [2 /*return*/];
                    }
                    if (!app.selfContext) {
                        debug('selfContext not available, skipping track bootstrap');
                        return [2 /*return*/];
                    }
                    resolution = isNumeric(config.resolution) ? parseFloat(config.resolution) : DEFAULT_RESOLUTION;
                    pointsToKeep = isNumeric(config.pointsToKeep) ? parseFloat(config.pointsToKeep) : DEFAULT_POINTS_TO_KEEP;
                    timespanMs = resolution * pointsToKeep;
                    resolutionSecs = Math.max(1, Math.round(resolution / 1000));
                    debug('Track bootstrap: requesting ' + Math.round(timespanMs / 1000 / 60) +
                        ' minutes of history at ' + resolutionSecs + 's resolution' +
                        ' (max ' + BOOTSTRAP_MAX_ATTEMPTS + ' attempts)');
                    noProviderCount = 0;
                    attempt = 1;
                    _a.label = 1;
                case 1:
                    if (!(attempt <= BOOTSTRAP_MAX_ATTEMPTS)) return [3 /*break*/, 8];
                    delay = attempt === 1 ? BOOTSTRAP_INITIAL_DELAY : BOOTSTRAP_RETRY_DELAY;
                    debug('Track bootstrap attempt ' + attempt + '/' + BOOTSTRAP_MAX_ATTEMPTS +
                        ', waiting ' + (delay / 1000) + 's...');
                    return [4 /*yield*/, sleep(delay)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 6, , 7]);
                    return [4 /*yield*/, app.getHistoryApi()];
                case 4:
                    historyApi = _a.sent();
                    noProviderCount = 0; // provider resolved — reset counter
                    to = new Date();
                    from = new Date(to.getTime() - timespanMs);
                    return [4 /*yield*/, historyApi.getValues({
                            context: app.selfContext,
                            from: from.toISOString(),
                            to: to.toISOString(),
                            pathSpecs: [{ path: 'navigation.position', aggregate: 'first' }],
                            resolution: resolutionSecs,
                        })];
                case 5:
                    response = _a.sent();
                    if (response && response.data && response.data.length > 0) {
                        positions = response.data
                            .filter(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        function (d) {
                            return (Array.isArray(d) &&
                                d.length >= 2 &&
                                Array.isArray(d[1]) &&
                                d[1].length === 2 &&
                                typeof d[1][0] === 'number' &&
                                typeof d[1][1] === 'number');
                        })
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            .map(function (d) { return [d[1][1], d[1][0]]; });
                        if (positions.length > 0) {
                            tracks.initialTrack(app.selfContext, positions);
                            debug('Track bootstrap complete: loaded ' + positions.length +
                                ' positions for self (' + Math.round(timespanMs / 1000 / 60) +
                                ' min window) on attempt ' + attempt);
                            return [2 /*return*/];
                        }
                    }
                    debug('History API returned no position data for bootstrap');
                    return [2 /*return*/]; // API responded successfully but no data — do not retry
                case 6:
                    err_1 = _a.sent();
                    if (isNoProviderError(err_1)) {
                        noProviderCount++;
                        debug('Track bootstrap attempt ' + attempt + '/' + BOOTSTRAP_MAX_ATTEMPTS +
                            ': no history provider registered yet (' + noProviderCount + '/' + BOOTSTRAP_MAX_NO_PROVIDER + ')');
                        if (noProviderCount >= BOOTSTRAP_MAX_NO_PROVIDER) {
                            debug('No history provider registered after ' + BOOTSTRAP_MAX_NO_PROVIDER +
                                ' consecutive checks — no provider plugin appears to be installed. Giving up.');
                            return [2 /*return*/];
                        }
                    }
                    else {
                        noProviderCount = 0; // different error — provider exists but not ready
                        debug('Track bootstrap attempt ' + attempt + '/' + BOOTSTRAP_MAX_ATTEMPTS +
                            ' failed: ' + errorDetail(err_1));
                    }
                    if (attempt === BOOTSTRAP_MAX_ATTEMPTS) {
                        app.error('Track bootstrap from History API failed after ' + BOOTSTRAP_MAX_ATTEMPTS +
                            ' attempts. Tracks will start empty and accumulate from live data.');
                    }
                    return [3 /*break*/, 7];
                case 7:
                    attempt++;
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function ThePlugin(app) {
    var onStop = [];
    var tracks = undefined;
    var defaultMaxRadius = undefined;
    function getVesselPosition() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var p = app.getSelfPath('navigation.position');
        return p && p.value ? [p.value.latitude, p.value.longitude] : undefined;
    }
    return {
        start: function (config) {
            var resolution = config.resolution, pointsToKeep = config.pointsToKeep, maxAge = config.maxAge, maxRadius = config.maxRadius;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            defaultMaxRadius = maxRadius ? parseFloat(maxRadius) : undefined;
            tracks = new tracks_1.Tracks({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                resolution: isNumeric(resolution) ? parseFloat(resolution) : DEFAULT_RESOLUTION,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                pointsToKeep: isNumeric(pointsToKeep) ? parseFloat(pointsToKeep) : DEFAULT_POINTS_TO_KEEP,
            }, app.debug);
            onStop.push(app.streambundle
                .getBus('navigation.position')
                .onValue(function (update) {
                return tracks === null || tracks === void 0 ? void 0 : tracks.newPosition(update.context, [update.value.latitude, update.value.longitude]);
            }));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            var theMaxAge = isNumeric(maxAge) ? parseFloat(maxAge) : DEFAULT_MAX_AGE;
            var pruneInterval = setInterval(tracks.prune.bind(tracks, theMaxAge * 1000), (theMaxAge * 1000) / 2);
            onStop.push(function () {
                clearInterval(pruneInterval);
            });
            // Bootstrap self track from History API (async, non-blocking)
            if (config.bootstrapFromHistory !== false) {
                bootstrapSelfTrack(app, tracks, config).catch(function (err) {
                    app.error('Unexpected error in track bootstrap: ' + err);
                });
            }
        },
        stop: function () {
            onStop.forEach(function (f) {
                try {
                    f();
                }
                catch (err) {
                    app.error(err);
                }
            });
            onStop = [];
        },
        signalKApiRoutes: function (router) {
            var trackHandler = function (req, res) {
                if (!tracks) {
                    notAvailable(res);
                    return;
                }
                tracks === null || tracks === void 0 ? void 0 : tracks.get("vessels.".concat(req.params.vesselId)).then(function (coordinates) {
                    res.json({
                        type: 'MultiLineString',
                        coordinates: [coordinates.map(toLngLat)],
                    });
                }).catch(function () {
                    res.status(404);
                    res.json({ message: "No track available for vessels.".concat(req.params.vesselId) });
                });
            };
            router.get('/vessels/:vesselId/track', trackHandler.bind(this));
            // return all / filtered vessel tracks
            var allTracksHandler = function (req, res) {
                app.debug(req.query);
                if (!tracks) {
                    notAvailable(res);
                    return;
                }
                tracks === null || tracks === void 0 ? void 0 : tracks.getFilteredTracks((0, utils_1.validateParameters)(req.query, defaultMaxRadius), getVesselPosition(), app.debug).then(function (tc) {
                    var trks = Object.entries(tc).reduce(function (acc, _a) {
                        var context = _a[0], track = _a[1];
                        acc[context] = {
                            type: 'MultiLineString',
                            coordinates: [track.map(toLngLat)],
                        };
                        return acc;
                    }, {});
                    res.json(trks);
                }).catch(function () {
                    res.status(404);
                    res.json({ message: "No track available for vessels." });
                });
            };
            router.get('/tracks', allTracksHandler.bind(this));
            router.get('/tracks/*', allTracksHandler.bind(this));
            return router;
        },
        id: 'tracks',
        name: 'Tracks',
        description: 'Accumulate tracks in memory for the track API implementation',
        schema: {
            type: 'object',
            properties: {
                resolution: {
                    type: 'integer',
                    title: 'Track resolution (milliseconds)',
                    default: DEFAULT_RESOLUTION,
                },
                pointsToKeep: {
                    type: 'integer',
                    title: 'Points to keep',
                    description: 'How many trackpoints to keep for each track',
                    default: DEFAULT_POINTS_TO_KEEP,
                },
                maxAge: {
                    type: 'integer',
                    title: 'Maximum idle time (seconds)',
                    description: 'Tracks with no updates longer than this are removed',
                    default: DEFAULT_MAX_AGE,
                },
                maxRadius: {
                    type: 'integer',
                    title: 'Maximum Radius (meters) ',
                    description: 'Include only vessels with position within this range. 0= all vessels',
                    default: DEFAULT_MAX_RADIUS,
                },
                bootstrapFromHistory: {
                    type: 'boolean',
                    title: 'Load historical tracks on startup',
                    description: 'On startup, load historical position data from the History API (requires a history provider such as signalk-to-influxdb2). Tracks will be available immediately after restart instead of starting empty.',
                    default: true,
                },
            },
        },
    };
}
var Tracks = /** @class */ (function (_super) {
    __extends(Tracks, _super);
    function Tracks() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Tracks;
}(tracks_1.Tracks));
exports.Tracks = Tracks;
var TrackAccumulator = /** @class */ (function (_super) {
    __extends(TrackAccumulator, _super);
    function TrackAccumulator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TrackAccumulator;
}(tracks_1.TrackAccumulator));
exports.TrackAccumulator = TrackAccumulator;
