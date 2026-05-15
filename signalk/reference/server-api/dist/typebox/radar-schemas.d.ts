/**
 * TypeBox Schema Definitions for the Signal K Radar API
 */
import { type Static } from '@sinclair/typebox';
export declare const RadarStatusSchema: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"off">, import("@sinclair/typebox").TLiteral<"standby">, import("@sinclair/typebox").TLiteral<"transmit">, import("@sinclair/typebox").TLiteral<"warming">]>;
export type RadarStatusSchemaType = Static<typeof RadarStatusSchema>;
export declare const RadarControlValueSchema: import("@sinclair/typebox").TObject<{
    auto: import("@sinclair/typebox").TBoolean;
    value: import("@sinclair/typebox").TNumber;
}>;
export type RadarControlValueSchemaType = Static<typeof RadarControlValueSchema>;
export declare const RadarControlsSchema: import("@sinclair/typebox").TObject<{
    gain: import("@sinclair/typebox").TRefUnsafe<import("@sinclair/typebox").TObject<{
        auto: import("@sinclair/typebox").TBoolean;
        value: import("@sinclair/typebox").TNumber;
    }>>;
    sea: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TRefUnsafe<import("@sinclair/typebox").TObject<{
        auto: import("@sinclair/typebox").TBoolean;
        value: import("@sinclair/typebox").TNumber;
    }>>>;
    rain: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        value: import("@sinclair/typebox").TNumber;
    }>>;
}>;
export type RadarControlsSchemaType = Static<typeof RadarControlsSchema>;
export declare const RadarInfoSchema: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TString;
    name: import("@sinclair/typebox").TString;
    brand: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    status: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"off">, import("@sinclair/typebox").TLiteral<"standby">, import("@sinclair/typebox").TLiteral<"transmit">, import("@sinclair/typebox").TLiteral<"warming">]>;
    spokesPerRevolution: import("@sinclair/typebox").TInteger;
    maxSpokeLen: import("@sinclair/typebox").TInteger;
    range: import("@sinclair/typebox").TNumber;
    controls: import("@sinclair/typebox").TObject<{
        gain: import("@sinclair/typebox").TRefUnsafe<import("@sinclair/typebox").TObject<{
            auto: import("@sinclair/typebox").TBoolean;
            value: import("@sinclair/typebox").TNumber;
        }>>;
        sea: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TRefUnsafe<import("@sinclair/typebox").TObject<{
            auto: import("@sinclair/typebox").TBoolean;
            value: import("@sinclair/typebox").TNumber;
        }>>>;
        rain: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            value: import("@sinclair/typebox").TNumber;
        }>>;
    }>;
    streamUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export type RadarInfoSchemaType = Static<typeof RadarInfoSchema>;
//# sourceMappingURL=radar-schemas.d.ts.map