"use strict";
/**
 * TypeBox Schema Definitions for the Signal K Resources API
 *
 * Covers routes, waypoints, regions, notes, and charts.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceActionCreatedResponseSchema = exports.ResourceActionOkResponseSchema = exports.ChartSchema = exports.MapServerSourceSchema = exports.TileLayerSourceSchema = exports.NoteSchema = exports.NoteBaseModelSchema = exports.RegionSchema = exports.WaypointSchema = exports.RouteSchema = exports.RoutePointMetaSchema = exports.BaseResponseModelSchema = exports.PositionAttributeSchema = exports.HrefAttributeSchema = exports.SignalKHrefSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const shared_schemas_1 = require("./shared-schemas");
/**
 * Signal K resource href — generic pointer to any resource type by UUID.
 */
exports.SignalKHrefSchema = typebox_1.Type.String({
    $id: 'SignalKHref',
    pattern: `^/resources/(\\w*)/${shared_schemas_1.SignalKUuidPattern}$`,
    description: 'Reference to a related resource. A pointer to the resource UUID.'
});
/** Href attribute — used to link a note to another resource */
exports.HrefAttributeSchema = typebox_1.Type.Object({
    href: exports.SignalKHrefSchema
}, { $id: 'HrefAttribute' });
/** Position attribute — used to give a note a geographic position */
exports.PositionAttributeSchema = typebox_1.Type.Object({
    position: shared_schemas_1.PositionSchema
}, { $id: 'ResourcePositionAttribute', description: 'Resource location.' });
exports.BaseResponseModelSchema = typebox_1.Type.Object({
    timestamp: typebox_1.Type.String({
        description: 'ISO 8601 timestamp of when the resource was last modified',
        examples: ['2024-01-15T12:30:00.000Z']
    }),
    $source: typebox_1.Type.String({
        description: 'Dot-separated identifier of the source that provided this resource (e.g. the resource provider plugin)',
        examples: ['resources-provider']
    })
}, {
    $id: 'BaseResponseModel',
    description: 'Metadata fields included in resource responses'
});
/** Route point metadata */
exports.RoutePointMetaSchema = typebox_1.Type.Object({
    name: typebox_1.Type.String({ description: 'Point name / identifier' })
}, {
    $id: 'RoutePointMeta',
    additionalProperties: true
});
/** Route resource */
exports.RouteSchema = typebox_1.Type.Object({
    name: typebox_1.Type.Optional(typebox_1.Type.String({ description: "Route's common name" })),
    description: typebox_1.Type.Optional(typebox_1.Type.String({ description: 'A description of the route' })),
    distance: typebox_1.Type.Optional(typebox_1.Type.Number({
        description: 'Total distance from start to end in meters',
        units: 'm',
        minimum: 0
    })),
    feature: typebox_1.Type.Object({
        geometry: shared_schemas_1.GeoJsonLinestringGeometrySchema,
        properties: typebox_1.Type.Optional(typebox_1.Type.Object({
            coordinatesMeta: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Union([exports.RoutePointMetaSchema, exports.HrefAttributeSchema]), {
                description: 'Metadata for each point within the route'
            }))
        }, { additionalProperties: true }))
    })
}, {
    $id: 'Route',
    description: 'A route resource'
});
/** Waypoint resource */
exports.WaypointSchema = typebox_1.Type.Object({
    name: typebox_1.Type.Optional(typebox_1.Type.String({ description: "Waypoint's common name" })),
    description: typebox_1.Type.Optional(typebox_1.Type.String({ description: 'A description of the waypoint' })),
    type: typebox_1.Type.Optional(typebox_1.Type.String({
        description: 'The type of point (e.g. Waypoint, PoI, Race Mark, etc)'
    })),
    feature: typebox_1.Type.Object({
        geometry: shared_schemas_1.GeoJsonPointGeometrySchema,
        properties: typebox_1.Type.Optional(typebox_1.Type.Object({}, {
            additionalProperties: true,
            description: 'Additional feature properties'
        }))
    })
}, {
    $id: 'Waypoint',
    description: 'A waypoint resource'
});
/** Region resource */
exports.RegionSchema = typebox_1.Type.Object({
    name: typebox_1.Type.Optional(typebox_1.Type.String({ description: "Region's common name" })),
    description: typebox_1.Type.Optional(typebox_1.Type.String({ description: 'A description of the region' })),
    feature: typebox_1.Type.Object({
        geometry: typebox_1.Type.Union([
            shared_schemas_1.GeoJsonPolygonGeometrySchema,
            shared_schemas_1.GeoJsonMultiPolygonGeometrySchema
        ]),
        properties: typebox_1.Type.Optional(typebox_1.Type.Object({}, {
            additionalProperties: true,
            description: 'Additional feature properties'
        }))
    })
}, {
    $id: 'Region',
    description: 'A region resource'
});
/** Note base model */
exports.NoteBaseModelSchema = typebox_1.Type.Object({
    title: typebox_1.Type.Optional(typebox_1.Type.String({ description: 'Title of note' })),
    description: typebox_1.Type.Optional(typebox_1.Type.String({ description: 'Text describing note' })),
    mimeType: typebox_1.Type.Optional(typebox_1.Type.String({
        description: 'MIME type of the note content',
        examples: ['text/plain', 'text/html', 'application/pdf']
    })),
    url: typebox_1.Type.Optional(typebox_1.Type.String({ description: 'Location of the note' })),
    properties: typebox_1.Type.Optional(typebox_1.Type.Object({}, {
        additionalProperties: true,
        description: 'Additional user defined note properties'
    }))
}, { $id: 'NoteBaseModel' });
/** Note resource — a note linked to either an href or a position */
exports.NoteSchema = typebox_1.Type.Intersect([
    exports.NoteBaseModelSchema,
    typebox_1.Type.Partial(typebox_1.Type.Object({
        href: exports.SignalKHrefSchema,
        position: shared_schemas_1.PositionSchema
    }))
], {
    $id: 'Note',
    description: 'A note resource — linked to either an href or a position'
});
/** Tile layer source */
exports.TileLayerSourceSchema = typebox_1.Type.Object({
    type: typebox_1.Type.Literal('tilelayer'),
    bounds: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Number(), {
        minItems: 4,
        maxItems: 4,
        description: 'Geographic bounding box in [west, south, east, north] order (longitude, latitude, longitude, latitude) in degrees'
    })),
    format: typebox_1.Type.Optional(typebox_1.Type.Union([
        typebox_1.Type.Literal('jpg'),
        typebox_1.Type.Literal('pbf'),
        typebox_1.Type.Literal('png'),
        typebox_1.Type.Literal('webp')
    ], { description: 'Tile image format' })),
    maxzoom: typebox_1.Type.Optional(typebox_1.Type.Number({
        minimum: 0,
        maximum: 30,
        default: 0,
        description: 'Maximum zoom level available'
    })),
    minzoom: typebox_1.Type.Optional(typebox_1.Type.Number({
        minimum: 0,
        maximum: 30,
        default: 0,
        description: 'Minimum zoom level available'
    })),
    scale: typebox_1.Type.Optional(typebox_1.Type.Number({
        minimum: 1,
        default: 250000,
        description: 'Chart scale denominator (e.g. 250000 for 1:250000)'
    }))
}, {
    $id: 'TileLayerSource',
    description: 'A tile layer chart source (XYZ/TMS tiles)'
});
/** Map server source */
exports.MapServerSourceSchema = typebox_1.Type.Object({
    type: typebox_1.Type.Union([
        typebox_1.Type.Literal('tileJSON'),
        typebox_1.Type.Literal('WMS'),
        typebox_1.Type.Literal('WMTS'),
        typebox_1.Type.Literal('mapstyleJSON'),
        typebox_1.Type.Literal('S-57')
    ])
}, {
    $id: 'MapServerSource',
    description: 'A map server chart source (WMS, WMTS, tileJSON, mapstyleJSON, or S-57)'
});
/** Chart resource */
exports.ChartSchema = typebox_1.Type.Intersect([
    typebox_1.Type.Object({
        identifier: typebox_1.Type.Optional(typebox_1.Type.String({ description: 'Chart identifier / number' })),
        name: typebox_1.Type.Optional(typebox_1.Type.String({ description: 'Chart name' })),
        description: typebox_1.Type.Optional(typebox_1.Type.String({ description: 'A text description of the chart' })),
        url: typebox_1.Type.Optional(typebox_1.Type.String({ description: 'URL to tile / map source' })),
        layers: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String(), {
            description: 'List of chart layer ids'
        }))
    }),
    typebox_1.Type.Union([exports.TileLayerSourceSchema, exports.MapServerSourceSchema])
], {
    $id: 'Chart',
    description: 'A chart resource'
});
/**
 * 200 success response with resource ID.
 */
exports.ResourceActionOkResponseSchema = typebox_1.Type.Object({
    state: typebox_1.Type.Literal('COMPLETED'),
    statusCode: typebox_1.Type.Literal(200),
    id: typebox_1.Type.String({
        pattern: `${shared_schemas_1.SignalKUuidPattern}$`,
        description: 'Resource UUID'
    })
}, { $id: 'ResourceActionOkResponse' });
/**
 * 201 created response with resource ID.
 */
exports.ResourceActionCreatedResponseSchema = typebox_1.Type.Object({
    state: typebox_1.Type.Literal('COMPLETED'),
    statusCode: typebox_1.Type.Literal(201),
    id: typebox_1.Type.String({
        pattern: `${shared_schemas_1.SignalKUuidPattern}$`,
        description: 'Resource UUID'
    })
}, { $id: 'ResourceActionCreatedResponse' });
