"use strict";
/**
 * Radar API Types
 *
 * Types and interfaces for the Signal K Radar API at
 * /signalk/v2/api/vessels/self/radars
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRadarProvider = void 0;
// ============================================================================
// Validation
// ============================================================================
/**
 * Type guard to validate a RadarProvider object.
 *
 * @category Radar API
 */
const isRadarProvider = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    const typedObj = obj;
    const methods = typedObj['methods'];
    return (typeof typedObj['name'] === 'string' &&
        typeof methods === 'object' &&
        methods !== null &&
        (typeof methods['pluginId'] === 'undefined' ||
            typeof methods['pluginId'] === 'string') &&
        typeof methods['getRadars'] === 'function' &&
        typeof methods['getRadarInfo'] === 'function');
};
exports.isRadarProvider = isRadarProvider;
