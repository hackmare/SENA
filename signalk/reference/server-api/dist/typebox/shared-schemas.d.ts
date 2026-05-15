/**
 * Shared TypeBox Schema Definitions for Signal K
 *
 * Domain object schemas and common patterns used across multiple APIs.
 *
 * Metadata (descriptions, units, examples) sourced from:
 *   specification/schemas/definitions.json
 *   specification/schemas/groups/navigation.json
 */
import { type Static } from '@sinclair/typebox';
/** Signal K UUID v4 pattern (without anchors) */
export declare const SignalKUuidPattern = "[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}";
/** ISO 8601 date-time pattern */
export declare const IsoTimePattern = "^(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2}):(\\d{2}(?:\\.\\d*)?)((-(\\d{2}):(\\d{2})|Z)?)$";
/**
 * ISO 8601 date-time string.
 * @see specification/schemas/definitions.json#/definitions/timestamp
 */
export declare const IsoTimeSchema: import("@sinclair/typebox").TString;
export type IsoTimeType = Static<typeof IsoTimeSchema>;
/**
 * Signal K UUID — Maritime Resource Name.
 * Format: urn:mrn:signalk:uuid:{uuid-v4}
 * @see specification/schemas/definitions.json#/definitions/uuid
 */
export declare const SignalKUuidSchema: import("@sinclair/typebox").TString;
/**
 * MMSI — Maritime Mobile Service Identity (vessel).
 * @see specification/schemas/definitions.json#/definitions/mmsi
 */
export declare const MmsiSchema: import("@sinclair/typebox").TString;
/**
 * Geographic position with latitude, longitude, and optional altitude.
 *
 * Canonical Position schema — all APIs reference this single definition.
 * @see specification/schemas/definitions.json#/definitions/position
 */
export declare const PositionSchema: import("@sinclair/typebox").TObject<{
    latitude: import("@sinclair/typebox").TNumber;
    longitude: import("@sinclair/typebox").TNumber;
    altitude: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
}>;
export type Position = Static<typeof PositionSchema>;
/**
 * Relative position origin — a circle defined by radius and center position.
 * Used for subscription context filtering.
 */
export declare const RelativePositionOriginSchema: import("@sinclair/typebox").TObject<{
    radius: import("@sinclair/typebox").TNumber;
    position: import("@sinclair/typebox").TObject<{
        latitude: import("@sinclair/typebox").TNumber;
        longitude: import("@sinclair/typebox").TNumber;
        altitude: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    }>;
}>;
export type RelativePositionOrigin = Static<typeof RelativePositionOriginSchema>;
/** GeoJSON Point geometry object (type + coordinates) */
export declare const GeoJsonPointGeometrySchema: import("@sinclair/typebox").TObject<{
    type: import("@sinclair/typebox").TLiteral<"Point">;
    coordinates: import("@sinclair/typebox").TTuple<[import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TNumber]>;
}>;
export type GeoJsonPointGeometry = Static<typeof GeoJsonPointGeometrySchema>;
/** GeoJSON LineString geometry object (type + coordinates) */
export declare const GeoJsonLinestringGeometrySchema: import("@sinclair/typebox").TObject<{
    type: import("@sinclair/typebox").TLiteral<"LineString">;
    coordinates: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TTuple<[import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TNumber]>>;
}>;
export type GeoJsonLinestringGeometry = Static<typeof GeoJsonLinestringGeometrySchema>;
/** GeoJSON Polygon geometry object (type + coordinates) */
export declare const GeoJsonPolygonGeometrySchema: import("@sinclair/typebox").TObject<{
    type: import("@sinclair/typebox").TLiteral<"Polygon">;
    coordinates: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TTuple<[import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TNumber]>>>;
}>;
export type GeoJsonPolygonGeometry = Static<typeof GeoJsonPolygonGeometrySchema>;
/** GeoJSON MultiPolygon geometry object (type + coordinates) */
export declare const GeoJsonMultiPolygonGeometrySchema: import("@sinclair/typebox").TObject<{
    type: import("@sinclair/typebox").TLiteral<"MultiPolygon">;
    coordinates: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TTuple<[import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TNumber]>>>>;
}>;
export type GeoJsonMultiPolygonGeometry = Static<typeof GeoJsonMultiPolygonGeometrySchema>;
/** Standard success response */
export declare const OkResponseSchema: import("@sinclair/typebox").TObject<{
    state: import("@sinclair/typebox").TLiteral<"COMPLETED">;
    statusCode: import("@sinclair/typebox").TLiteral<200>;
}>;
/** Standard error response */
export declare const ErrorResponseSchema: import("@sinclair/typebox").TObject<{
    state: import("@sinclair/typebox").TLiteral<"FAILED">;
    statusCode: import("@sinclair/typebox").TNumber;
    message: import("@sinclair/typebox").TString;
}>;
//# sourceMappingURL=shared-schemas.d.ts.map