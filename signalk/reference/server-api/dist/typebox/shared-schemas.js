"use strict";
/**
 * Shared TypeBox Schema Definitions for Signal K
 *
 * Domain object schemas and common patterns used across multiple APIs.
 *
 * Metadata (descriptions, units, examples) sourced from:
 *   specification/schemas/definitions.json
 *   specification/schemas/groups/navigation.json
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponseSchema = exports.OkResponseSchema = exports.GeoJsonMultiPolygonGeometrySchema = exports.GeoJsonPolygonGeometrySchema = exports.GeoJsonLinestringGeometrySchema = exports.GeoJsonPointGeometrySchema = exports.RelativePositionOriginSchema = exports.PositionSchema = exports.MmsiSchema = exports.SignalKUuidSchema = exports.IsoTimeSchema = exports.IsoTimePattern = exports.SignalKUuidPattern = void 0;
const typebox_1 = require("@sinclair/typebox");
/** Signal K UUID v4 pattern (without anchors) */
exports.SignalKUuidPattern = '[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}';
/** ISO 8601 date-time pattern */
exports.IsoTimePattern = '^(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2}):(\\d{2}(?:\\.\\d*)?)((-(\\d{2}):(\\d{2})|Z)?)$';
/**
 * ISO 8601 date-time string.
 * @see specification/schemas/definitions.json#/definitions/timestamp
 */
exports.IsoTimeSchema = typebox_1.Type.String({
    $id: 'IsoTime',
    pattern: exports.IsoTimePattern,
    description: 'ISO 8601 date-time string',
    examples: ['2022-04-22T05:02:56.484Z']
});
/**
 * Signal K UUID — Maritime Resource Name.
 * Format: urn:mrn:signalk:uuid:{uuid-v4}
 * @see specification/schemas/definitions.json#/definitions/uuid
 */
exports.SignalKUuidSchema = typebox_1.Type.String({
    $id: 'SignalKUuid',
    pattern: `^urn:mrn:signalk:uuid:${exports.SignalKUuidPattern}$`,
    description: 'A unique Signal K flavoured maritime resource identifier (MRN). ' +
        'Format: urn:mrn:signalk:uuid:{uuid-v4}',
    examples: ['urn:mrn:signalk:uuid:b7590868-1d62-47d9-989c-32321b349fb9']
});
/**
 * MMSI — Maritime Mobile Service Identity (vessel).
 * @see specification/schemas/definitions.json#/definitions/mmsi
 */
exports.MmsiSchema = typebox_1.Type.String({
    $id: 'Mmsi',
    pattern: '^[2-7][0-9]{8}$',
    description: 'Maritime Mobile Service Identity (MMSI). 9 digits, first digit 2-7.',
    examples: ['503123456']
});
/**
 * Geographic position with latitude, longitude, and optional altitude.
 *
 * Canonical Position schema — all APIs reference this single definition.
 * @see specification/schemas/definitions.json#/definitions/position
 */
exports.PositionSchema = typebox_1.Type.Object({
    latitude: typebox_1.Type.Number({
        minimum: -90,
        maximum: 90,
        description: 'Latitude',
        units: 'deg',
        examples: [52.0987654]
    }),
    longitude: typebox_1.Type.Number({
        minimum: -180,
        maximum: 180,
        description: 'Longitude',
        units: 'deg',
        examples: [4.98765245]
    }),
    altitude: typebox_1.Type.Optional(typebox_1.Type.Number({
        description: 'Altitude',
        units: 'm',
        examples: [12.5]
    }))
}, {
    $id: 'SignalKPosition',
    description: 'The position in 3 dimensions'
});
/**
 * Relative position origin — a circle defined by radius and center position.
 * Used for subscription context filtering.
 */
exports.RelativePositionOriginSchema = typebox_1.Type.Object({
    radius: typebox_1.Type.Number({
        minimum: 0,
        description: 'Radius in meters',
        units: 'm'
    }),
    position: exports.PositionSchema
}, {
    $id: 'RelativePositionOrigin',
    description: 'A circle defined by radius and center position'
});
/** GeoJSON Point geometry object (type + coordinates) */
exports.GeoJsonPointGeometrySchema = typebox_1.Type.Object({
    type: typebox_1.Type.Literal('Point'),
    coordinates: typebox_1.Type.Tuple([
        typebox_1.Type.Number({ description: 'Longitude' }),
        typebox_1.Type.Number({ description: 'Latitude' })
    ])
}, {
    $id: 'GeoJsonPointGeometry',
    description: 'GeoJSON Point geometry — [longitude, latitude]'
});
/** GeoJSON LineString geometry object (type + coordinates) */
exports.GeoJsonLinestringGeometrySchema = typebox_1.Type.Object({
    type: typebox_1.Type.Literal('LineString'),
    coordinates: typebox_1.Type.Array(typebox_1.Type.Tuple([
        typebox_1.Type.Number({ description: 'Longitude' }),
        typebox_1.Type.Number({ description: 'Latitude' })
    ]), { minItems: 2 })
}, {
    $id: 'GeoJsonLineStringGeometry',
    description: 'GeoJSON LineString geometry — array of [lon, lat] pairs'
});
/** GeoJSON Polygon geometry object (type + coordinates) */
exports.GeoJsonPolygonGeometrySchema = typebox_1.Type.Object({
    type: typebox_1.Type.Literal('Polygon'),
    coordinates: typebox_1.Type.Array(typebox_1.Type.Array(typebox_1.Type.Tuple([
        typebox_1.Type.Number({ description: 'Longitude' }),
        typebox_1.Type.Number({ description: 'Latitude' })
    ]), { minItems: 4 }))
}, {
    $id: 'GeoJsonPolygonGeometry',
    description: 'GeoJSON Polygon geometry — array of linear rings'
});
/** GeoJSON MultiPolygon geometry object (type + coordinates) */
exports.GeoJsonMultiPolygonGeometrySchema = typebox_1.Type.Object({
    type: typebox_1.Type.Literal('MultiPolygon'),
    coordinates: typebox_1.Type.Array(typebox_1.Type.Array(typebox_1.Type.Array(typebox_1.Type.Tuple([
        typebox_1.Type.Number({ description: 'Longitude' }),
        typebox_1.Type.Number({ description: 'Latitude' })
    ]), { minItems: 4 })))
}, {
    $id: 'GeoJsonMultiPolygonGeometry',
    description: 'GeoJSON MultiPolygon geometry'
});
/** Standard success response */
exports.OkResponseSchema = typebox_1.Type.Object({
    state: typebox_1.Type.Literal('COMPLETED'),
    statusCode: typebox_1.Type.Literal(200)
}, { $id: 'OkResponse' });
/** Standard error response */
exports.ErrorResponseSchema = typebox_1.Type.Object({
    state: typebox_1.Type.Literal('FAILED'),
    statusCode: typebox_1.Type.Number(),
    message: typebox_1.Type.String()
}, { $id: 'ErrorResponse', description: 'Request error response' });
