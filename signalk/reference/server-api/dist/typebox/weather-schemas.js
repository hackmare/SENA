"use strict";
/**
 * TypeBox Schema Definitions for the Signal K Weather API
 *
 * Units follow SI conventions: K (temperature), Pa (pressure), m/s (speed),
 * rad (direction), m (distance/visibility), ratio (humidity/cloud).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherWarningModelSchema = exports.WeatherDataModelSchema = exports.PrecipitationTypeSchema = exports.PressureTendencySchema = exports.WeatherDataTypeSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const shared_schemas_1 = require("./shared-schemas");
/** Weather data type */
exports.WeatherDataTypeSchema = typebox_1.Type.Union([typebox_1.Type.Literal('daily'), typebox_1.Type.Literal('point'), typebox_1.Type.Literal('observation')], { $id: 'WeatherDataType' });
/** Pressure tendency */
exports.PressureTendencySchema = typebox_1.Type.Union([
    typebox_1.Type.Literal('steady'),
    typebox_1.Type.Literal('decreasing'),
    typebox_1.Type.Literal('increasing')
], { $id: 'PressureTendency' });
/** Precipitation type */
exports.PrecipitationTypeSchema = typebox_1.Type.Union([
    typebox_1.Type.Literal('rain'),
    typebox_1.Type.Literal('thunderstorm'),
    typebox_1.Type.Literal('snow'),
    typebox_1.Type.Literal('freezing rain'),
    typebox_1.Type.Literal('mixed/ice')
], { $id: 'PrecipitationType' });
/**
 * Weather data model — observation, daily forecast, or point forecast.
 */
exports.WeatherDataModelSchema = typebox_1.Type.Object({
    date: shared_schemas_1.IsoTimeSchema,
    description: typebox_1.Type.Optional(typebox_1.Type.String({
        description: 'Weather description',
        examples: ['broken clouds']
    })),
    type: exports.WeatherDataTypeSchema,
    sun: typebox_1.Type.Optional(typebox_1.Type.Object({
        sunrise: typebox_1.Type.Optional(shared_schemas_1.IsoTimeSchema),
        sunset: typebox_1.Type.Optional(shared_schemas_1.IsoTimeSchema)
    })),
    outside: typebox_1.Type.Optional(typebox_1.Type.Object({
        uvIndex: typebox_1.Type.Optional(typebox_1.Type.Number({
            description: 'UV Index (1 UVI = 25mW/sqm)',
            examples: [7.5]
        })),
        cloudCover: typebox_1.Type.Optional(typebox_1.Type.Number({
            description: 'Amount of cloud cover (ratio)',
            examples: [0.85]
        })),
        horizontalVisibility: typebox_1.Type.Optional(typebox_1.Type.Number({
            description: 'Visibility (m)',
            units: 'm',
            examples: [5000]
        })),
        horizontalVisibilityOverRange: typebox_1.Type.Optional(typebox_1.Type.Boolean({
            description: 'Visibility distance is greater than the range of the measuring equipment'
        })),
        temperature: typebox_1.Type.Optional(typebox_1.Type.Number({
            description: 'Air temperature (K)',
            units: 'K',
            examples: [290]
        })),
        feelsLikeTemperature: typebox_1.Type.Optional(typebox_1.Type.Number({
            description: 'Feels-like temperature (K)',
            units: 'K',
            examples: [277]
        })),
        dewPointTemperature: typebox_1.Type.Optional(typebox_1.Type.Number({
            description: 'Dew point temperature (K)',
            units: 'K',
            examples: [260]
        })),
        pressure: typebox_1.Type.Optional(typebox_1.Type.Number({
            description: 'Air pressure (Pa)',
            units: 'Pa',
            examples: [10100]
        })),
        pressureTendency: typebox_1.Type.Optional(exports.PressureTendencySchema),
        absoluteHumidity: typebox_1.Type.Optional(typebox_1.Type.Number({
            description: 'Absolute humidity (ratio)',
            examples: [0.56]
        })),
        relativeHumidity: typebox_1.Type.Optional(typebox_1.Type.Number({
            description: 'Relative humidity (ratio)',
            examples: [0.56]
        })),
        precipitationType: typebox_1.Type.Optional(exports.PrecipitationTypeSchema),
        precipitationVolume: typebox_1.Type.Optional(typebox_1.Type.Number({
            description: 'Amount of precipitation (m)',
            units: 'm',
            examples: [0.56]
        }))
    })),
    wind: typebox_1.Type.Optional(typebox_1.Type.Object({
        averageSpeed: typebox_1.Type.Optional(typebox_1.Type.Number({
            description: 'Average wind speed (m/s)',
            units: 'm/s',
            examples: [9.3]
        })),
        speedTrue: typebox_1.Type.Optional(typebox_1.Type.Number({
            description: 'Wind speed (m/s)',
            units: 'm/s',
            examples: [15.3]
        })),
        directionTrue: typebox_1.Type.Optional(typebox_1.Type.Number({
            description: 'Wind direction relative to true north (rad)',
            units: 'rad',
            examples: [2.145]
        })),
        gust: typebox_1.Type.Optional(typebox_1.Type.Number({
            description: 'Wind gust (m/s)',
            units: 'm/s',
            examples: [21.6]
        })),
        gustDirectionTrue: typebox_1.Type.Optional(typebox_1.Type.Number({
            description: 'Wind gust direction relative to true north (rad)',
            units: 'rad',
            examples: [2.6]
        }))
    })),
    water: typebox_1.Type.Optional(typebox_1.Type.Object({
        temperature: typebox_1.Type.Optional(typebox_1.Type.Number({
            description: 'Water temperature (K)',
            units: 'K',
            examples: [281.6]
        })),
        level: typebox_1.Type.Optional(typebox_1.Type.Number({
            description: 'Water level (m)',
            units: 'm',
            examples: [11.9]
        })),
        levelTendency: typebox_1.Type.Optional(typebox_1.Type.Union([
            typebox_1.Type.Literal('steady'),
            typebox_1.Type.Literal('decreasing'),
            typebox_1.Type.Literal('increasing')
        ])),
        waves: typebox_1.Type.Optional(typebox_1.Type.Object({
            significantHeight: typebox_1.Type.Optional(typebox_1.Type.Number({
                description: 'Wave height (m)',
                units: 'm',
                examples: [2.6]
            })),
            directionTrue: typebox_1.Type.Optional(typebox_1.Type.Number({
                description: 'Wave direction relative to true north (rad)',
                units: 'rad',
                examples: [2.3876]
            })),
            period: typebox_1.Type.Optional(typebox_1.Type.Number({
                description: 'Wave period (s)',
                units: 's',
                examples: [2.3876]
            }))
        })),
        swell: typebox_1.Type.Optional(typebox_1.Type.Object({
            height: typebox_1.Type.Optional(typebox_1.Type.Number({
                description: 'Swell height (m)',
                units: 'm',
                examples: [2.6]
            })),
            directionTrue: typebox_1.Type.Optional(typebox_1.Type.Number({
                description: 'Swell direction relative to true north (rad)',
                units: 'rad',
                examples: [2.3876]
            })),
            period: typebox_1.Type.Optional(typebox_1.Type.Number({
                description: 'Swell period (s)',
                units: 's',
                examples: [2.3876]
            }))
        })),
        seaState: typebox_1.Type.Optional(typebox_1.Type.Number({ description: 'Sea state (Beaufort)', examples: [2] })),
        salinity: typebox_1.Type.Optional(typebox_1.Type.Number({
            description: 'Water salinity (ratio)',
            examples: [0.12]
        })),
        ice: typebox_1.Type.Optional(typebox_1.Type.Boolean({ description: 'Whether ice is present' }))
    })),
    current: typebox_1.Type.Optional(typebox_1.Type.Object({
        drift: typebox_1.Type.Optional(typebox_1.Type.Number({
            description: 'Surface current speed (m/s)',
            units: 'm/s',
            examples: [3.4]
        })),
        set: typebox_1.Type.Optional(typebox_1.Type.Number({
            description: 'Surface current direction (rad)',
            units: 'rad',
            examples: [1.74]
        }))
    }))
}, {
    $id: 'WeatherDataModel',
    description: 'Weather data — observation, daily forecast, or point forecast'
});
/**
 * Weather warning — time-bound severe weather advisory.
 */
exports.WeatherWarningModelSchema = typebox_1.Type.Object({
    startTime: shared_schemas_1.IsoTimeSchema,
    endTime: shared_schemas_1.IsoTimeSchema,
    source: typebox_1.Type.Optional(typebox_1.Type.String({ description: 'Name of source.' })),
    type: typebox_1.Type.Optional(typebox_1.Type.String({
        description: 'Type of warning.',
        examples: ['Heat Advisory']
    })),
    details: typebox_1.Type.Optional(typebox_1.Type.String({
        description: 'Text describing the details of the warning.',
        examples: [
            'HEAT ADVISORY REMAINS IN EFFECT FROM 1 PM THIS AFTERNOON....'
        ]
    }))
}, {
    $id: 'WeatherWarningModel',
    description: 'Weather warning — time-bound severe weather advisory'
});
