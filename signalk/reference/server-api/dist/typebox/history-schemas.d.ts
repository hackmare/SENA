/**
 * TypeBox Schema Definitions for the Signal K History API
 */
import { type Static } from '@sinclair/typebox';
export declare const AggregateMethodSchema: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"average">, import("@sinclair/typebox").TLiteral<"min">, import("@sinclair/typebox").TLiteral<"max">, import("@sinclair/typebox").TLiteral<"first">, import("@sinclair/typebox").TLiteral<"last">, import("@sinclair/typebox").TLiteral<"mid">, import("@sinclair/typebox").TLiteral<"middle_index">, import("@sinclair/typebox").TLiteral<"sma">, import("@sinclair/typebox").TLiteral<"ema">]>;
export type AggregateMethodSchemaType = Static<typeof AggregateMethodSchema>;
export declare const ValuesResponseSchema: import("@sinclair/typebox").TObject<{
    context: import("@sinclair/typebox").TString;
    range: import("@sinclair/typebox").TObject<{
        from: import("@sinclair/typebox").TString;
        to: import("@sinclair/typebox").TString;
    }>;
    values: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        path: import("@sinclair/typebox").TString;
        method: import("@sinclair/typebox").TString;
    }>>;
    data: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TNull, import("@sinclair/typebox").TArray<import("@sinclair/typebox").TNumber>]>>>;
}>;
export type ValuesResponseSchemaType = Static<typeof ValuesResponseSchema>;
export declare const PathSpecSchema: import("@sinclair/typebox").TObject<{
    path: import("@sinclair/typebox").TString;
    aggregate: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"average">, import("@sinclair/typebox").TLiteral<"min">, import("@sinclair/typebox").TLiteral<"max">, import("@sinclair/typebox").TLiteral<"first">, import("@sinclair/typebox").TLiteral<"last">, import("@sinclair/typebox").TLiteral<"mid">, import("@sinclair/typebox").TLiteral<"middle_index">, import("@sinclair/typebox").TLiteral<"sma">, import("@sinclair/typebox").TLiteral<"ema">]>;
    parameter: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
}>;
export type PathSpecSchemaType = Static<typeof PathSpecSchema>;
export declare const HistoryProviderInfoSchema: import("@sinclair/typebox").TObject<{
    isDefault: import("@sinclair/typebox").TBoolean;
}>;
export type HistoryProviderInfoSchemaType = Static<typeof HistoryProviderInfoSchema>;
export declare const HistoryProvidersResponseSchema: import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TObject<{
    isDefault: import("@sinclair/typebox").TBoolean;
}>>;
export type HistoryProvidersResponseSchemaType = Static<typeof HistoryProvidersResponseSchema>;
//# sourceMappingURL=history-schemas.d.ts.map