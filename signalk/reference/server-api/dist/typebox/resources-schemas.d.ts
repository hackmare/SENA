/**
 * TypeBox Schema Definitions for the Signal K Resources API
 *
 * Covers routes, waypoints, regions, notes, and charts.
 */
import { type Static } from '@sinclair/typebox';
/**
 * Signal K resource href — generic pointer to any resource type by UUID.
 */
export declare const SignalKHrefSchema: import("@sinclair/typebox").TString;
/** Href attribute — used to link a note to another resource */
export declare const HrefAttributeSchema: import("@sinclair/typebox").TObject<{
    href: import("@sinclair/typebox").TString;
}>;
/** Position attribute — used to give a note a geographic position */
export declare const PositionAttributeSchema: import("@sinclair/typebox").TObject<{
    position: import("@sinclair/typebox").TObject<{
        latitude: import("@sinclair/typebox").TNumber;
        longitude: import("@sinclair/typebox").TNumber;
        altitude: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    }>;
}>;
export declare const BaseResponseModelSchema: import("@sinclair/typebox").TObject<{
    timestamp: import("@sinclair/typebox").TString;
    $source: import("@sinclair/typebox").TString;
}>;
/** Route point metadata */
export declare const RoutePointMetaSchema: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
}>;
/** Route resource */
export declare const RouteSchema: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    distance: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    feature: import("@sinclair/typebox").TObject<{
        geometry: import("@sinclair/typebox").TObject<{
            type: import("@sinclair/typebox").TLiteral<"LineString">;
            coordinates: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TTuple<[import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TNumber]>>;
        }>;
        properties: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            coordinatesMeta: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
                name: import("@sinclair/typebox").TString;
            }>, import("@sinclair/typebox").TObject<{
                href: import("@sinclair/typebox").TString;
            }>]>>>;
        }>>;
    }>;
}>;
export type RouteResource = Static<typeof RouteSchema>;
/** Waypoint resource */
export declare const WaypointSchema: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    feature: import("@sinclair/typebox").TObject<{
        geometry: import("@sinclair/typebox").TObject<{
            type: import("@sinclair/typebox").TLiteral<"Point">;
            coordinates: import("@sinclair/typebox").TTuple<[import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TNumber]>;
        }>;
        properties: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{}>>;
    }>;
}>;
export type WaypointResource = Static<typeof WaypointSchema>;
/** Region resource */
export declare const RegionSchema: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    feature: import("@sinclair/typebox").TObject<{
        geometry: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
            type: import("@sinclair/typebox").TLiteral<"Polygon">;
            coordinates: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TTuple<[import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TNumber]>>>;
        }>, import("@sinclair/typebox").TObject<{
            type: import("@sinclair/typebox").TLiteral<"MultiPolygon">;
            coordinates: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TTuple<[import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TNumber]>>>>;
        }>]>;
        properties: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{}>>;
    }>;
}>;
export type RegionResource = Static<typeof RegionSchema>;
/** Note base model */
export declare const NoteBaseModelSchema: import("@sinclair/typebox").TObject<{
    title: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    mimeType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    properties: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{}>>;
}>;
/** Note resource — a note linked to either an href or a position */
export declare const NoteSchema: import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
    title: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    mimeType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    properties: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{}>>;
}>, import("@sinclair/typebox").TObject<{
    href: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    position: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        latitude: import("@sinclair/typebox").TNumber;
        longitude: import("@sinclair/typebox").TNumber;
        altitude: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    }>>;
}>]>;
export type NoteResource = Static<typeof NoteSchema>;
/** Tile layer source */
export declare const TileLayerSourceSchema: import("@sinclair/typebox").TObject<{
    type: import("@sinclair/typebox").TLiteral<"tilelayer">;
    bounds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TNumber>>;
    format: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"jpg">, import("@sinclair/typebox").TLiteral<"pbf">, import("@sinclair/typebox").TLiteral<"png">, import("@sinclair/typebox").TLiteral<"webp">]>>;
    maxzoom: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    minzoom: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    scale: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
}>;
/** Map server source */
export declare const MapServerSourceSchema: import("@sinclair/typebox").TObject<{
    type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"tileJSON">, import("@sinclair/typebox").TLiteral<"WMS">, import("@sinclair/typebox").TLiteral<"WMTS">, import("@sinclair/typebox").TLiteral<"mapstyleJSON">, import("@sinclair/typebox").TLiteral<"S-57">]>;
}>;
/** Chart resource */
export declare const ChartSchema: import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
    identifier: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    layers: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
}>, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
    type: import("@sinclair/typebox").TLiteral<"tilelayer">;
    bounds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TNumber>>;
    format: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"jpg">, import("@sinclair/typebox").TLiteral<"pbf">, import("@sinclair/typebox").TLiteral<"png">, import("@sinclair/typebox").TLiteral<"webp">]>>;
    maxzoom: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    minzoom: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    scale: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
}>, import("@sinclair/typebox").TObject<{
    type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"tileJSON">, import("@sinclair/typebox").TLiteral<"WMS">, import("@sinclair/typebox").TLiteral<"WMTS">, import("@sinclair/typebox").TLiteral<"mapstyleJSON">, import("@sinclair/typebox").TLiteral<"S-57">]>;
}>]>]>;
export type ChartResource = Static<typeof ChartSchema>;
/**
 * 200 success response with resource ID.
 */
export declare const ResourceActionOkResponseSchema: import("@sinclair/typebox").TObject<{
    state: import("@sinclair/typebox").TLiteral<"COMPLETED">;
    statusCode: import("@sinclair/typebox").TLiteral<200>;
    id: import("@sinclair/typebox").TString;
}>;
/**
 * 201 created response with resource ID.
 */
export declare const ResourceActionCreatedResponseSchema: import("@sinclair/typebox").TObject<{
    state: import("@sinclair/typebox").TLiteral<"COMPLETED">;
    statusCode: import("@sinclair/typebox").TLiteral<201>;
    id: import("@sinclair/typebox").TString;
}>;
//# sourceMappingURL=resources-schemas.d.ts.map