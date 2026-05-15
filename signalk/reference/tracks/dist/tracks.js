"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackAccumulator = exports.Tracks = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var utils_1 = require("./utils");
var Tracks = /** @class */ (function () {
    function Tracks(config, debug) {
        this.tracks = {};
        debug(JSON.stringify(config));
        this.config = config;
        this.debug = debug;
    }
    Tracks.prototype.newPosition = function (context, position) {
        var _a;
        (_a = this.getAccumulator(context)) === null || _a === void 0 ? void 0 : _a.nextLatLngTuple(position);
    };
    Tracks.prototype.initialTrack = function (context, track) {
        var _a;
        (_a = this.getAccumulator(context)) === null || _a === void 0 ? void 0 : _a.setInitialTrack(track);
    };
    Tracks.prototype.getAccumulator = function (context, createIfMissing) {
        if (createIfMissing === void 0) { createIfMissing = true; }
        if (context.indexOf('vessels.') === -1 && context.indexOf('aircraft.') === -1) {
            return undefined;
        }
        var result = this.tracks[context];
        if (!result && createIfMissing) {
            var accParams = __assign({}, this.config);
            if (this.config.fetchInitialTrack) {
                accParams.fetchTrackFor = context;
            }
            result = this.tracks[context] = new TrackAccumulator(accParams);
        }
        return result;
    };
    Tracks.prototype.get = function (context) {
        var accumulator = this.getAccumulator(context, false);
        if (accumulator) {
            return accumulator.track.pipe((0, operators_1.take)(1)).toPromise();
        }
        else {
            return Promise.reject();
        }
    };
    Tracks.prototype.getAllTracks = function () {
        var _this = this;
        return Promise.all(Object.keys(this.tracks).map(function (context) {
            return _this.get(context).then(function (track) { return ({
                context: context,
                track: track,
            }); });
        }));
    };
    // Return all / filtered vessels and their tracks
    Tracks.prototype.getFilteredTracks = function (params, selfPosition, debug) {
        return __awaiter(this, void 0, void 0, function () {
            var matcher;
            return __generator(this, function (_a) {
                this.debug(params);
                this.debug('Self position', selfPosition);
                matcher = (0, utils_1.createMatcher)(params, selfPosition, debug);
                return [2 /*return*/, this.getAllTracks().then(function (contextTracks) {
                        return contextTracks.reduce(function (acc, _a) {
                            var context = _a.context, track = _a.track;
                            var c = context;
                            var t = track;
                            if (matcher(t)) {
                                acc[c] = t;
                            }
                            return acc;
                        }, {});
                    })];
            });
        });
    };
    Tracks.prototype.prune = function (maxAge) {
        var _this = this;
        var cutoff = Date.now() - maxAge;
        var deleted = [];
        Object.entries(this.tracks).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (value.latestLatLngTuple < cutoff) {
                delete _this.tracks[key];
                deleted.push(key);
            }
        });
        if (this.debug.enabled) {
            this.debug("deleted tracks for ".concat(deleted));
        }
    };
    return Tracks;
}());
exports.Tracks = Tracks;
var TrackAccumulator = /** @class */ (function () {
    function TrackAccumulator(_a) {
        var resolution = _a.resolution, pointsToKeep = _a.pointsToKeep, fetchTrackFor = _a.fetchTrackFor;
        var _this = this;
        this.initialTrack = new rxjs_1.BehaviorSubject([]);
        this.input = new rxjs_1.Subject();
        this.latestLatLngTuple = 0;
        this.accumulatedTrack = this.input.pipe((0, operators_1.throttleTime)(resolution), (0, operators_1.scan)(function (acc, position) {
            acc.push(position);
            return acc.slice(Math.max(0, acc.length - pointsToKeep));
        }, []), (0, operators_1.publishReplay)(1));
        this.track = (0, rxjs_1.combineLatest)([this.initialTrack, this.accumulatedTrack]).pipe((0, operators_1.map)(function (_a) {
            var initialTrack = _a[0], accumulatedTrack = _a[1];
            return __spreadArray(__spreadArray([], initialTrack, true), accumulatedTrack, true);
        }));
        var connectable = this.accumulatedTrack;
        connectable.connect();
        if (fetchTrackFor) {
            fetchTrack(fetchTrackFor).then(function (trackGEOJson) {
                if (trackGEOJson && trackGEOJson.coordinates && trackGEOJson.coordinates[0]) {
                    _this.initialTrack.next(trackGEOJson.coordinates[0]);
                }
            });
        }
    }
    TrackAccumulator.prototype.nextLatLngTuple = function (position) {
        this.input.next(position);
        this.latestLatLngTuple = Date.now();
    };
    TrackAccumulator.prototype.setInitialTrack = function (track) {
        this.initialTrack.next(track);
    };
    return TrackAccumulator;
}());
exports.TrackAccumulator = TrackAccumulator;
var fetchTrack = function (context) {
    var contextParts = context.split('.');
    if (contextParts[0] !== 'vessels') {
        return Promise.resolve({});
    }
    return fetch("/signalk/v1/api/vessels/".concat(contextParts[1], "/track"), {
        credentials: 'include',
    }).then(function (r) { return (r.status === 200 ? r.json() : Promise.resolve({})); });
};
