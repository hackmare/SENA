"use strict";
/**
 * TypeBox Schema Definitions for the Signal K History API
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryProvidersResponseSchema = exports.HistoryProviderInfoSchema = exports.PathSpecSchema = exports.ValuesResponseSchema = exports.AggregateMethodSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.AggregateMethodSchema = typebox_1.Type.Union([
    typebox_1.Type.Literal('average'),
    typebox_1.Type.Literal('min'),
    typebox_1.Type.Literal('max'),
    typebox_1.Type.Literal('first'),
    typebox_1.Type.Literal('last'),
    typebox_1.Type.Literal('mid'),
    typebox_1.Type.Literal('middle_index'),
    typebox_1.Type.Literal('sma'),
    typebox_1.Type.Literal('ema')
], {
    $id: 'AggregateMethod',
    description: "Aggregation method for historical data. The 'sma' (Simple Moving Average) and 'ema' (Exponential Moving Average) methods accept an optional numeric parameter separated by colon: for sma it is the number of samples, for ema it is the alpha value (0-1)."
});
exports.ValuesResponseSchema = typebox_1.Type.Object({
    context: typebox_1.Type.String({
        description: 'Signal K context that the data is about',
        examples: ['vessels.urn:mrn:imo:mmsi:123456789']
    }),
    range: typebox_1.Type.Object({
        from: typebox_1.Type.String({
            format: 'date-time',
            description: 'Start of the time range, inclusive, as UTC timestamp',
            examples: ['2018-03-20T09:12:28Z']
        }),
        to: typebox_1.Type.String({
            format: 'date-time',
            description: 'End of the time range, inclusive, as UTC timestamp',
            examples: ['2018-03-20T09:13:28Z']
        })
    }),
    values: typebox_1.Type.Array(typebox_1.Type.Object({
        path: typebox_1.Type.String({ description: 'Signal K path' }),
        method: typebox_1.Type.String({ description: 'Aggregation method' })
    })),
    data: typebox_1.Type.Array(typebox_1.Type.Array(typebox_1.Type.Union([
        typebox_1.Type.String(),
        typebox_1.Type.Number(),
        typebox_1.Type.Null(),
        typebox_1.Type.Array(typebox_1.Type.Number())
    ]), {
        description: 'Data for a point in time. The first array element is the timestamp in ISO 8601 format. Missing data for a path is returned as null'
    }), {
        examples: [[['2023-11-09T02:45:38.160Z', 13.2, null, [-120.5, 59.2]]]]
    })
}, {
    $id: 'HistoryValuesResponse',
    description: 'Historical data series with header and data rows'
});
exports.PathSpecSchema = typebox_1.Type.Object({
    path: typebox_1.Type.String({ description: 'Signal K path' }),
    aggregate: exports.AggregateMethodSchema,
    parameter: typebox_1.Type.Array(typebox_1.Type.String(), {
        description: 'Additional parameters for the aggregation method (e.g., sample count for sma, alpha for ema)'
    })
}, {
    $id: 'PathSpec',
    description: 'Specification for a path to query, including the aggregation method and optional parameters'
});
exports.HistoryProviderInfoSchema = typebox_1.Type.Object({
    isDefault: typebox_1.Type.Boolean({
        description: '`true` if this provider is set as the default.'
    })
}, { $id: 'HistoryProviderInfo' });
exports.HistoryProvidersResponseSchema = typebox_1.Type.Record(typebox_1.Type.String({ description: 'Plugin id of the history provider' }), exports.HistoryProviderInfoSchema, {
    $id: 'HistoryProvidersResponse',
    description: 'Map of registered history providers keyed by plugin id'
});
