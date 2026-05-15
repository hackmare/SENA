"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWeatherProvider = void 0;
/**
 * Type guard to check if an object is a valid WeatherProvider.
 * @category Weather API
 */
const isWeatherProvider = (obj) => {
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
        typeof methods['getObservations'] ===
            'function' &&
        typeof methods['getForecasts'] ===
            'function' &&
        typeof methods['getWarnings'] === 'function');
};
exports.isWeatherProvider = isWeatherProvider;
