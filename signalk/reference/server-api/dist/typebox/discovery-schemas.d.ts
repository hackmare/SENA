/**
 * TypeBox Schema Definitions for the Signal K Discovery API
 */
import { type Static } from '@sinclair/typebox';
/**
 * v1 endpoint descriptor — protocol addresses for a specific API version.
 */
export declare const V1EndpointSchema: import("@sinclair/typebox").TObject<{
    version: import("@sinclair/typebox").TString;
    'signalk-http': import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    'signalk-ws': import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    'signalk-tcp': import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
/**
 * Discovery response — server version and service endpoints.
 */
export declare const DiscoveryDataSchema: import("@sinclair/typebox").TObject<{
    endpoints: import("@sinclair/typebox").TObject<{
        v1: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            version: import("@sinclair/typebox").TString;
            'signalk-http': import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            'signalk-ws': import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            'signalk-tcp': import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>>;
    }>;
    server: import("@sinclair/typebox").TObject<{
        id: import("@sinclair/typebox").TString;
        version: import("@sinclair/typebox").TString;
    }>;
}>;
export type DiscoveryData = Static<typeof DiscoveryDataSchema>;
/**
 * Plugin metadata for feature discovery.
 */
export declare const PluginMetaDataSchema: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TString;
    name: import("@sinclair/typebox").TString;
    version: import("@sinclair/typebox").TString;
}>;
export type PluginMetaData = Static<typeof PluginMetaDataSchema>;
/**
 * Server features response — available APIs and installed plugins.
 */
export declare const FeaturesModelSchema: import("@sinclair/typebox").TObject<{
    apis: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
    plugins: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        id: import("@sinclair/typebox").TString;
        name: import("@sinclair/typebox").TString;
        version: import("@sinclair/typebox").TString;
    }>>;
}>;
export type FeaturesModel = Static<typeof FeaturesModelSchema>;
//# sourceMappingURL=discovery-schemas.d.ts.map